class TweenHelper {
  static flashElement(scene, element, repeat = true, easing = 'Linear', overallDuration = 300, visiblePauseDuration = 150) {
    if (scene && element) {
      let flashDuration = overallDuration - visiblePauseDuration / 2;

      scene.tweens.timeline({
        tweens: [
          {
            targets: element,
            duration: 0,
            alpha: 0,
            ease: easing
          },
          {
            targets: element,
            duration: flashDuration,
            alpha: 1,
            ease: easing
          },
          {
            targets: element,
            duration: visiblePauseDuration,
            alpha: 1,
            ease: easing
          },
          {
            targets: element,
            duration: flashDuration,
            alpha: 0,
            ease: easing,
            onComplete: () => {
              if (repeat === true) {
                this.flashElement(scene, element);
              }
            }
          }
        ]
      });
    }
  }
}