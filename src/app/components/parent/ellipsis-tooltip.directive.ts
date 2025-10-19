import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2
} from '@angular/core';

type TooltipPlacement = 'top' | 'bottom';

@Directive({
  selector: '[manoEllipsisTooltip]'
})
export class ManoEllipsisTooltipDirective {
  @Input('manoEllipsisTooltip') tooltipText?: string;
  @Input() manoEllipsisTooltipPlacement: TooltipPlacement = 'top'; // mặc định top

  private tooltipElement?: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  private isEllipsisActive(): boolean {
    const element = this.el.nativeElement as HTMLElement;
    return element.scrollWidth > element.clientWidth;
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    const text = (this.tooltipText ?? this.el.nativeElement.innerText ?? '')
      .toString()
      .trim();
    if (this.isEllipsisActive() && text) {
      this.showTooltip(text);
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.hideTooltip();
  }

  private showTooltip(text: string) {
    if (!text) return;

    this.tooltipElement = this.renderer.createElement('div');
    this.tooltipElement!.innerText = text;

    // Style tooltip
    this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(this.tooltipElement, 'background', '#333');
    this.renderer.setStyle(this.tooltipElement, 'color', '#fff');
    this.renderer.setStyle(this.tooltipElement, 'padding', '6px 12px');
    this.renderer.setStyle(this.tooltipElement, 'borderRadius', '4px');
    this.renderer.setStyle(this.tooltipElement, 'fontSize', '12px');
    this.renderer.setStyle(this.tooltipElement, 'zIndex', '1000');
    this.renderer.setStyle(this.tooltipElement, 'opacity', '0');
    this.renderer.setStyle(this.tooltipElement, 'transition', 'opacity 0.2s ease-out');

    // Ngăn tooltip tràn màn hình: max-width + xuống dòng
    this.renderer.setStyle(this.tooltipElement, 'maxWidth', '700px');
    this.renderer.setStyle(this.tooltipElement, 'whiteSpace', 'normal');
    this.renderer.setStyle(this.tooltipElement, 'wordBreak', 'break-word');

    // Tính vị trí
    const rect = this.el.nativeElement.getBoundingClientRect();
    let placement = this.manoEllipsisTooltipPlacement;

    // Auto flip nếu tooltip bị tràn ra ngoài màn hình
    const estimatedHeight = 40; // ước lượng
    if (placement === 'top' && rect.top < estimatedHeight) {
      placement = 'bottom';
    }
    if (placement === 'bottom' && rect.bottom + estimatedHeight > window.innerHeight) {
      placement = 'top';
    }

    // Đặt vị trí dựa trên placement
    if (placement === 'bottom') {
      this.renderer.setStyle(
        this.tooltipElement,
        'top',
        `${rect.bottom + window.scrollY + 2}px`
      );
    } else {
      const tooltipHeight = 24;
      this.renderer.setStyle(
        this.tooltipElement,
        'top',
        `${rect.top + window.scrollY - tooltipHeight - 2}px`
      );
    }
    this.renderer.setStyle(
      this.tooltipElement,
      'left',
      `${rect.left + window.scrollX}px`
    );

    this.renderer.appendChild(document.body, this.tooltipElement);

    // Fade-in
    requestAnimationFrame(() => {
      if (this.tooltipElement) {
        this.renderer.setStyle(this.tooltipElement, 'opacity', '1');
      }
    });
  }

  private hideTooltip() {
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
      this.tooltipElement = undefined;
    }
  }
}
