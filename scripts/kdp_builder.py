#!/usr/bin/env python3
"""
KDP Book Builder — OPC生存手册 HTML → KDP-ready PDF
=====================================================
Converts docs/index.html to a print-ready PDF formatted for
Amazon KDP 6×9 inch paperback with bleed settings.

Requirements: pip install beautifulsoup4 reportlab

Usage:
    python kdp_builder.py
    python kdp_builder.py --input docs/index.html --output output/opc-handbook.pdf
    python kdp_builder.py --format a5        # A5 format
    python kdp_builder.py --no-bleed          # without bleed
"""

import argparse
import os
import sys
import re
from pathlib import Path

try:
    from bs4 import BeautifulSoup
except ImportError:
    print("Error: beautifulsoup4 required. Run: pip install beautifulsoup4")
    sys.exit(1)

try:
    from reportlab.lib.pagesizes import letter, A4
    from reportlab.lib.units import inch, mm, cm
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.colors import HexColor, black, white
    from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
    from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer,
                                     PageBreak, Table, TableStyle, KeepTogether)
    from reportlab.platypus.doctemplate import PageTemplate, BaseDocTemplate, Frame
    from reportlab.platypus.frames import Frame
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    from reportlab.pdfbase.cidfonts import UnicodeCIDFont
except ImportError:
    print("Error: reportlab required. Run: pip install reportlab")
    sys.exit(1)


# ═══════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════

# KDP standard sizes
PAGE_SIZES = {
    "6x9": (6 * inch, 9 * inch),          # Standard KDP paperback
    "5x8": (5 * inch, 8 * inch),
    "5.5x8.5": (5.5 * inch, 8.5 * inch),
    "a5": (148 * mm, 210 * mm),
    "7x10": (7 * inch, 10 * inch),
}

# Bleed settings for KDP (adds 0.125" = 3.2mm on each edge)
BLEED = 0.125 * inch

# Colors — Cyber-Craftsman palette
COLORS = {
    "bg": HexColor("#F7F5F2"),
    "text": HexColor("#1A1C2E"),
    "text2": HexColor("#4A4D5E"),
    "gold": HexColor("#F5A623"),
    "blue": HexColor("#6C9BCF"),
    "divider": HexColor("#E5E0D8"),
    "accent_bg": HexColor("#FFF8EB"),
    "white": white,
}


# ═══════════════════════════════════════════════════════════════
# FONT SETUP
# ═══════════════════════════════════════════════════════════════

def register_fonts():
    """Register CJK fonts. Tries multiple fallback strategies."""
    # Strategy 1: Try common system CJK fonts
    cjk_fonts = [
        # Linux
        "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
        "/usr/share/fonts/noto-cjk/NotoSansCJK-Regular.ttc",
        "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
        "/usr/share/fonts/opentype/noto/NotoSansSC-Regular.otf",
        "/usr/share/fonts/truetype/droid/DroidSansFallbackFull.ttf",
        "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc",
        "/usr/share/fonts/truetype/wqy/wqy-microhei.ttc",
        # macOS
        "/System/Library/Fonts/PingFang.ttc",
        "/System/Library/Fonts/STHeiti Light.ttc",
        "/Library/Fonts/Arial Unicode.ttf",
        # Windows
        "C:/Windows/Fonts/msyh.ttc",
        "C:/Windows/Fonts/simsun.ttc",
    ]
    
    font_name = None
    font_bold_name = None
    
    for path in cjk_fonts:
        if os.path.exists(path):
            try:
                pdfmetrics.registerFont(TTFont("CJK", path))
                font_name = "CJK"
                font_bold_name = "CJK"
                print(f"  ✓ Registered CJK font: {path}")
                break
            except Exception:
                continue
    
    # Strategy 2: Use built-in CID fonts (always available in reportlab)
    if font_name is None:
        try:
            pdfmetrics.registerFont(UnicodeCIDFont('STSong-Light'))
            font_name = 'STSong-Light'
            font_bold_name = 'STSong-Light'
            print("  ✓ Using built-in CID font: STSong-Light")
        except Exception:
            pass
    
    # Strategy 3: Last resort
    if font_name is None:
        print("  ⚠ No CJK font found. Chinese characters may not render.")
        print("    Install: sudo apt install fonts-noto-cjk")
        font_name = "Helvetica"
        font_bold_name = "Helvetica-Bold"
    
    return font_name, font_bold_name


# ═══════════════════════════════════════════════════════════════
# CONTENT EXTRACTION
# ═══════════════════════════════════════════════════════════════

def extract_chapters(html_path):
    """Parse HTML and extract structured chapter content."""
    with open(html_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    
    title = soup.title.string if soup.title else "OPC生存手册"
    
    chapters = []
    for article in soup.find_all('article', class_='chapter'):
        ch = {}
        # Chapter number
        num_span = article.find('span', class_='chapter-num')
        ch['number'] = num_span.get_text(strip=True) if num_span else ""
        
        # Chapter emoji
        emoji_span = article.find('span', class_='chapter-emoji')
        ch['emoji'] = emoji_span.get_text(strip=True) if emoji_span else ""
        
        # Title
        h2 = article.find('h2')
        ch['title'] = h2.get_text(strip=True) if h2 else ""
        
        # Tagline
        tagline = article.find('p', class_='tagline')
        ch['tagline'] = tagline.get_text(strip=True) if tagline else ""
        
        # Sections
        sections = []
        for section in article.find_all('div', class_='section'):
            sec = {}
            h3 = section.find('h3')
            sec['heading'] = h3.get_text(strip=True) if h3 else ""
            
            # Collect all text content in order
            content_parts = []
            for elem in section.children:
                if elem.name == 'p':
                    content_parts.append(('p', elem.get_text(strip=True)))
                elif elem.name in ('ul', 'ol'):
                    items = []
                    for li in elem.find_all('li'):
                        items.append(li.get_text(strip=True))
                    content_parts.append((elem.name, items))
                elif elem.name == 'blockquote':
                    content_parts.append(('quote', elem.get_text(strip=True)))
                elif elem.name == 'div' and 'highlight-box' in elem.get('class', []):
                    label = elem.find('div', class_='label')
                    label_text = label.get_text(strip=True) if label else ""
                    box_parts = []
                    for p in elem.find_all('p'):
                        box_parts.append(p.get_text(strip=True))
                    content_parts.append(('box', {'label': label_text, 'content': box_parts}))
                elif elem.name == 'div' and 'table-wrap' in elem.get('class', []):
                    content_parts.append(('table_skip', None))  # Skip tables for now
            
            sec['content'] = content_parts
            sections.append(sec)
        
        ch['sections'] = sections
        
        # Data cards
        data_cards = []
        for card in article.find_all('div', class_='data-card'):
            number = card.find('div', class_='number')
            desc = card.find('div', class_='desc')
            data_cards.append({
                'number': number.get_text(strip=True) if number else "",
                'desc': desc.get_text(strip=True) if desc else ""
            })
        ch['data_cards'] = data_cards
        
        # Phase cards
        phase_cards = []
        for card in article.find_all('div', class_='phase-card'):
            title_elem = card.find('div', class_='p-title')
            meta_elem = card.find('div', class_='p-meta')
            phase_cards.append({
                'title': title_elem.get_text(strip=True) if title_elem else "",
                'meta': meta_elem.get_text(strip=True) if meta_elem else ""
            })
        ch['phase_cards'] = phase_cards
        
        chapters.append(ch)
    
    return title, chapters


# ═══════════════════════════════════════════════════════════════
# PDF GENERATION
# ═══════════════════════════════════════════════════════════════

def build_pdf(chapters, output_path, page_size, font_name, font_bold_name, book_title="OPC生存手册", subtitle="AI时代一人创作者的生存实战指南"):
    """Generate the KDP-ready PDF."""
    
    pw, ph = page_size
    
    # Build styles
    styles = getSampleStyleSheet()
    
    # Title style
    styles.add(ParagraphStyle(
        'CoverTitle', fontName=font_bold_name, fontSize=28, leading=36,
        alignment=TA_CENTER, textColor=COLORS['text'], spaceAfter=12
    ))
    styles.add(ParagraphStyle(
        'CoverSubtitle', fontName=font_name, fontSize=14, leading=20,
        alignment=TA_CENTER, textColor=COLORS['text2'], spaceAfter=24
    ))
    
    # Chapter heading styles
    styles.add(ParagraphStyle(
        'ChapterNum', fontName=font_name, fontSize=11, leading=16,
        textColor=COLORS['gold'], spaceAfter=4
    ))
    styles.add(ParagraphStyle(
        'ChapterTitle', fontName=font_bold_name, fontSize=22, leading=30,
        textColor=COLORS['text'], spaceAfter=6
    ))
    styles.add(ParagraphStyle(
        'ChapterTagline', fontName=font_name, fontSize=12, leading=18,
        textColor=COLORS['text2'], spaceAfter=20, leftIndent=4
    ))
    
    # Section styles
    styles.add(ParagraphStyle(
        'SectionHead', fontName=font_bold_name, fontSize=14, leading=20,
        textColor=COLORS['blue'], spaceBefore=16, spaceAfter=8,
        borderPadding=(0, 0, 0, 8), leftIndent=8
    ))
    styles.add(ParagraphStyle(
        'BodyText2', fontName=font_name, fontSize=10.5, leading=17,
        textColor=COLORS['text'], spaceAfter=10, alignment=TA_JUSTIFY,
        firstLineIndent=20
    ))
    styles.add(ParagraphStyle(
        'BulletItem', fontName=font_name, fontSize=10.5, leading=17,
        textColor=COLORS['text'], spaceAfter=4, leftIndent=20, bulletIndent=8
    ))
    styles.add(ParagraphStyle(
        'QuoteStyle', fontName=font_name, fontSize=10, leading=16,
        textColor=COLORS['text2'], spaceAfter=12, leftIndent=24, rightIndent=12,
        borderColor=COLORS['gold'], borderWidth=2, borderPadding=8
    ))
    styles.add(ParagraphStyle(
        'BoxLabel', fontName=font_bold_name, fontSize=9, leading=14,
        textColor=COLORS['gold'], spaceAfter=4
    ))
    styles.add(ParagraphStyle(
        'BoxText', fontName=font_name, fontSize=10, leading=16,
        textColor=COLORS['text'], spaceAfter=6, leftIndent=8
    ))
    styles.add(ParagraphStyle(
        'TOCItem', fontName=font_name, fontSize=11, leading=18,
        textColor=COLORS['text'], spaceAfter=6, leftIndent=12
    ))
    styles.add(ParagraphStyle(
        'TOCNum', fontName=font_bold_name, fontSize=10, leading=18,
        textColor=COLORS['gold']
    ))
    styles.add(ParagraphStyle(
        'FooterStyle', fontName=font_name, fontSize=9, leading=12,
        textColor=COLORS['text2'], alignment=TA_CENTER
    ))
    
    # Build story (content flow)
    story = []
    
    # ── COVER PAGE ──
    story.append(Spacer(1, 2 * inch))
    story.append(Paragraph(book_title, styles['CoverTitle']))
    story.append(Paragraph(subtitle, styles['CoverSubtitle']))
    story.append(Spacer(1, 0.5 * inch))
    story.append(Paragraph("第一版 · 2026", styles['CoverSubtitle']))
    story.append(Paragraph("由人类创作者与AI工具协作完成", styles['FooterStyle']))
    story.append(PageBreak())
    
    # ── TABLE OF CONTENTS ──
    story.append(Paragraph("📑 目录", styles['ChapterTitle']))
    story.append(Spacer(1, 16))
    for i, ch in enumerate(chapters):
        num = ch['number'].replace('第', '').replace('章', '')
        emoji = ch.get('emoji', '')
        title = ch['title']
        if title.startswith(f'{emoji} '):
            title = title[len(emoji)+1:]
        toc_text = f"{num}. {title}"
        story.append(Paragraph(toc_text, styles['TOCItem']))
    story.append(PageBreak())
    
    # ── CHAPTERS ──
    for ch_idx, ch in enumerate(chapters):
        # Chapter header
        num = ch.get('number', f'第{ch_idx+1}章')
        emoji = ch.get('emoji', '')
        title = ch.get('title', '')
        tagline = ch.get('tagline', '')
        
        story.append(Paragraph(f"{num}", styles['ChapterNum']))
        story.append(Paragraph(f"{emoji} {title}", styles['ChapterTitle']))
        if tagline:
            story.append(Paragraph(tagline, styles['ChapterTagline']))
        story.append(Spacer(1, 8))
        
        # Divider line
        story.append(Spacer(1, 4))
        story.append(Paragraph("─" * 60, styles['FooterStyle']))
        story.append(Spacer(1, 8))
        
        # Data cards (if any) - render as a simple box
        if ch.get('data_cards'):
            cards_text = []
            for card in ch['data_cards']:
                cards_text.append(f"  {card['number']} — {card['desc']}")
            text = "\n".join(cards_text)
            story.append(Paragraph(text, styles['BoxText']))
            story.append(Spacer(1, 8))
        
        # Sections
        for section in ch.get('sections', []):
            heading = section.get('heading', '')
            if heading:
                story.append(Paragraph(heading, styles['SectionHead']))
            
            for content_type, content_data in section.get('content', []):
                if content_type == 'p':
                    story.append(Paragraph(content_data, styles['BodyText2']))
                elif content_type == 'ul':
                    for item in content_data:
                        story.append(Paragraph(f"• {item}", styles['BulletItem']))
                elif content_type == 'ol':
                    for i, item in enumerate(content_data, 1):
                        story.append(Paragraph(f"{i}. {item}", styles['BulletItem']))
                elif content_type == 'quote':
                    story.append(Paragraph(content_data, styles['QuoteStyle']))
                elif content_type == 'box':
                    box_data = content_data
                    if box_data.get('label'):
                        story.append(Paragraph(box_data['label'], styles['BoxLabel']))
                    for line in box_data.get('content', []):
                        story.append(Paragraph(line, styles['BoxText']))
                elif content_type == 'table_skip':
                    story.append(Paragraph("[数据表格 — 请在正式排版中插入]", styles['FooterStyle']))
        
        # Phase cards (if any) - render inline
        if ch.get('phase_cards'):
            story.append(Spacer(1, 8))
            for card in ch['phase_cards']:
                text = f"▸ {card['title']} — {card['meta']}"
                story.append(Paragraph(text, styles['BoxText']))
            story.append(Spacer(1, 8))
        
        # Page break between chapters (don't break before first chapter)
        if ch_idx < len(chapters) - 1:
            story.append(PageBreak())
    
    # ── FOOTER / COLOPHON ──
    story.append(PageBreak())
    story.append(Spacer(1, 2 * inch))
    story.append(Paragraph("📘 OPC生存手册", styles['CoverTitle']))
    story.append(Paragraph("第一版 · 2026", styles['CoverSubtitle']))
    story.append(Spacer(1, 0.5 * inch))
    story.append(Paragraph("本书由人类创作者与AI工具协作完成", styles['FooterStyle']))
    story.append(Paragraph("觉得有用？分享给3个也在独立创作的朋友", styles['FooterStyle']))
    
    # ── BUILD PDF ──
    doc = SimpleDocTemplate(
        output_path,
        pagesize=page_size,
        leftMargin=0.85 * inch,
        rightMargin=0.85 * inch,
        topMargin=0.75 * inch,
        bottomMargin=0.75 * inch,
        title=book_title,
        author="OPC Community",
        subject="One Person Creator Survival Guide",
    )
    
    doc.build(story)
    return output_path


# ═══════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════

def main():
    parser = argparse.ArgumentParser(
        description="OPC Handbook → KDP-ready PDF Builder",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python kdp_builder.py
  python kdp_builder.py --input docs/index.html --output output/opc.pdf
  python kdp_builder.py --format 5x8 --no-bleed
  python kdp_builder.py --format a5
        """
    )
    parser.add_argument('--input', default='docs/index.html',
                        help='Input HTML file (default: docs/index.html)')
    parser.add_argument('--output', default='output/opc-handbook.pdf',
                        help='Output PDF path (default: output/opc-handbook.pdf)')
    parser.add_argument('--format', default='6x9', choices=list(PAGE_SIZES.keys()),
                        help='Book trim size (default: 6x9)')
    parser.add_argument('--no-bleed', action='store_true',
                        help='Disable bleed margin (not recommended for KDP)')
    parser.add_argument('--title', default='OPC生存手册',
                        help='Book title')
    parser.add_argument('--subtitle', default='AI时代一人创作者的生存实战指南',
                        help='Book subtitle')
    
    args = parser.parse_args()
    
    # Resolve paths from both the current working directory and repo root, so
    # `python3 scripts/kdp_builder.py` works from the repository root.
    script_dir = Path(__file__).parent.resolve()
    repo_root = script_dir.parent

    raw_input = Path(args.input)
    if raw_input.is_absolute():
        input_path = raw_input
    else:
        input_candidates = [
            Path.cwd() / raw_input,
            repo_root / raw_input,
            script_dir / raw_input,
        ]
        input_path = next((path for path in input_candidates if path.exists()), input_candidates[0])

    raw_output = Path(args.output)
    output_path = raw_output if raw_output.is_absolute() else repo_root / raw_output
    
    if not input_path.exists():
        print(f"Error: Input file not found: {input_path}")
        sys.exit(1)
    
    # Ensure output directory exists
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    page_size = PAGE_SIZES[args.format]
    using_bleed = not args.no_bleed
    
    print(f"{'='*60}")
    print(f"  OPC KDP Builder")
    print(f"{'='*60}")
    print(f"  Input:     {input_path}")
    print(f"  Output:    {output_path}")
    print(f"  Format:    {args.format} ({page_size[0]/inch:.1f}×{page_size[1]/inch:.1f} in)")
    print(f"  Bleed:     {'Yes (+0.125 in)' if using_bleed else 'No'}")
    print(f"{'='*60}")
    
    # Register fonts
    print("  Registering fonts...")
    font_name, font_bold_name = register_fonts()
    
    # Extract content
    print(f"  Extracting chapters from HTML...")
    book_title, chapters = extract_chapters(str(input_path))
    print(f"  Found {len(chapters)} chapters")
    for ch in chapters:
        section_count = len(ch.get('sections', []))
        print(f"    {ch['number']}: {ch['title']} ({section_count} sections)")
    
    # Build PDF
    print(f"  Building PDF...")
    result = build_pdf(
        chapters, str(output_path), page_size,
        font_name, font_bold_name,
        book_title=args.title or book_title,
        subtitle=args.subtitle
    )
    
    # Report
    file_size = os.path.getsize(result)
    print(f"  ✓ PDF generated: {result}")
    print(f"  ✓ File size: {file_size / 1024:.1f} KB")
    print(f"{'='*60}")
    
    if file_size < 1024:
        print("  ⚠ Warning: PDF is very small. Fonts may not have rendered correctly.")
        print("    Install CJK fonts: sudo apt install fonts-noto-cjk")
    else:
        print("  ✓ Ready for KDP upload!")
        print(f"    Next: Upload to https://kdp.amazon.com")


if __name__ == '__main__':
    main()
