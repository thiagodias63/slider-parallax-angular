import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '#image-track'
})
export class ImageTrackDirective {

  constructor(private elementRef: ElementRef) {
    const imageTrack = this.elementRef.nativeElement;

    const handleOnDown = (e: any) => imageTrack.dataset.mouseDownAt = e.clientX;

    const handleOnUp = () => {
      imageTrack.dataset.mouseDownAt = "0";
      imageTrack.dataset.prevPercentage = imageTrack.dataset.percentage;
    }

    const handleOnMove = (e: any) => {
      if (imageTrack.dataset.mouseDownAt === "0") return;

      const mouseDelta = parseFloat(imageTrack.dataset.mouseDownAt) - e.clientX,
        maxDelta = window.innerWidth / 2;

      const percentage = (mouseDelta / maxDelta) * -100,
        nextPercentageUnconstrained = parseFloat(imageTrack.dataset.prevPercentage) + percentage,
        nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

      imageTrack.dataset.percentage = nextPercentage;

      imageTrack.animate({
        transform: `translate(${nextPercentage}%, -50%)`
      }, { duration: 1200, fill: "forwards" });

      for (const image of imageTrack.getElementsByClassName("image")) {
        image.animate({
          objectPosition: `${100 + nextPercentage}% center`
        }, { duration: 1200, fill: "forwards" });
      }
    }

    window.onmousedown = e => handleOnDown(e);

    window.ontouchstart = e => handleOnDown(e.touches[0]);

    window.onmouseup = _ => handleOnUp();

    window.ontouchend = _ => handleOnUp();

    window.onmousemove = e => handleOnMove(e);

    window.ontouchmove = e => handleOnMove(e.touches[0]);
  }
}
