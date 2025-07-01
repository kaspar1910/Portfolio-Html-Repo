import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
    activeTab: string = 'about';
    deployCount: string = '...';

    @ViewChild('tabOverlay') tabOverlay!: ElementRef;
    @ViewChild('tabsContainer') tabsContainer!: ElementRef;
    @ViewChild('contentBox') contentBox!: ElementRef;

    constructor(private renderer: Renderer2) {}

    ngAfterViewInit(): void {
        this.loadDeployCount();
        this.setupProximityShadow();
        this.setupScrollFadeIn();
    }

    showTab(tab: string) {
        this.activeTab = tab;
    }

    loadDeployCount() {
        fetch('deploy-count.txt')
            .then(res => res.text())
            .then(data => this.deployCount = data.trim())
            .catch(() => this.deployCount = 'N/A');
    }

    setupProximityShadow() {
        window.addEventListener('mousemove', (e) => {
            const rect = this.tabsContainer.nativeElement.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 300;

            if (distance < maxDistance) {
                const intensity = 0.4 * (1 - distance / maxDistance);
                this.renderer.setStyle(
                    this.tabOverlay.nativeElement,
                    'background',
                    `radial-gradient(circle at ${e.clientX}px ${e.clientY}px, rgba(0,0,0,${intensity}), transparent 150px)`
                );
            } else {
                this.renderer.setStyle(this.tabOverlay.nativeElement, 'background', 'transparent');
            }
        });
    }

    setupScrollFadeIn() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.renderer.addClass(this.contentBox.nativeElement, 'visible');
                }
            });
        }, { threshold: 0.2 });

        observer.observe(this.contentBox.nativeElement);
    }
}