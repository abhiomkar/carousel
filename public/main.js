class Gallery {
  constructor() {
    // alert('v2');
    this.root = document.querySelector('.gallery');    
    this.slider = this.root.querySelector('.slider');
    this.items = this.root.querySelectorAll('.item');

    this.rootRect = this.root.getBoundingClientRect();

    this.offset_ = 0;
    this.startX;
    this.currentX;
    this.prevPositionX = 0;
    this.isDragging = false;
    this.speed = 0;
    this.defaultTransition = this.slider.style.transition;

    this.registerEvents();
  }

  registerEvents() {
    this.root.addEventListener('touchstart', event => this.onTouchStart(event));
    this.root.addEventListener('touchmove', event => this.onTouchMove(event));
    this.root.addEventListener('touchend', event => this.onTouchEnd(event));
  }

  onTouchStart(event) {
    this.slider.style.transition = this.defaultTransition;

    this.startX = event.pageX || event.touches[0].pageX;
    this.panStartX = this.startX;
    this.startTimeMs = (new Date()).getTime();
    this.isDragging = true;
    this.watchPanning();
  }

  onTouchMove(event) {    
    this.currentX = event.pageX || event.touches[0].pageX;

    let offset = this.prevPositionX + (this.currentX - this.startX);
    
    const currentTimeMs = (new Date()).getTime();
    
    if (this.lastMovedTimeMs) {
      this.swipeDirection = this.lastMovedX - this.currentX < 0 ? 'right' : 'left';
      this.speed = Math.abs(this.currentX - this.lastMovedX) / (currentTimeMs - this.lastMovedTimeMs);
    }
    // console.log('Speed: ', this.speed);
    requestAnimationFrame(() => {
      if (offset > 0) {
        offset = 0;
      }
      this.slider.style.transform = `translateX(${offset}px)`;
      this.lastMovedTimeMs = (new Date()).getTime();
      this.lastMovedX = this.currentX;
    });
  }

  onTouchEnd(event) {
    if (this.currentX === undefined) return;

    this.prevPositionX = this.prevPositionX + (this.currentX - this.startX);
    this.endTimeMs = (new Date()).getTime();
    this.isDragging = false;

    console.log('Speed', this.speed);
    if (this.speed > 8) {
      this.speed = 8;
    }

    // console.log('Swipped', this.swipeDirection);
    let slideDistance = this.swipeDirection == 'left' ? (this.prevPositionX + this.prevPositionX * this.speed/3)
                                                         : (this.prevPositionX - this.prevPositionX * this.speed/3);
    
    console.log('slideDistance: ', slideDistance);
    requestAnimationFrame(() => {
      if (this.speed > 0.5) {
        const transitionSpeed = this.speed * 0.45;
        this.slider.style.transition = `transform ${transitionSpeed}s cubic-bezier(0,0,0.31,1)`;

        if (slideDistance > 0) {
          slideDistance = 0;
        } else {
          const lastItem = this.items[this.items.length - 1];

          const lastItemRect = lastItem.getBoundingClientRect();
          const sliderRect = this.slider.getBoundingClientRect();

          const maxOffsetDistance = (this.root.offsetWidth - this.slider.scrollWidth);
          if (slideDistance < maxOffsetDistance) {
            slideDistance = maxOffsetDistance;
          }
        }
        this.slider.style.transform = `translateX(${slideDistance}px)`;
        this.prevPositionX = slideDistance;
      } else {
        this.slider.style.transition = this.defaultTransition;
      }
    });

    return;

    const target = event.target;
    const targetRect = target.getBoundingClientRect();

    this.offset_ += this.rootRect.x - targetRect.x;

    console.log('Offset: ', this.offset_);  
    this.moveItemsByOffset_(this.offset_);
  }

  watchPanning() {
    return;
    requestAnimationFrame(() => {
      this.watchPanning();
    });
  }

  moveItemsByOffset_(offset) {
    requestAnimationFrame(() => {
      for (const item of this.items) {
        item.style.transform = `translateX(${offset}px)`;
      }
    });
  }
}

window.addEventListener('load', () => new Gallery());