import { Component, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-roulette-game',
  template: `
    <canvas #gameCanvas style="width: 100%; height: 100vh;"></canvas>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
  `,
  styles: ['canvas { display: block; }']
})
export class RouletteGameComponent implements AfterViewInit {
  @ViewChild('gameCanvas', { static: false }) gameCanvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  // Screen dimensions
  screenWidth: number = window.innerWidth;
  screenHeight: number = window.innerHeight;

  // Game state
  teams: string[] = ["TEAM A", "TEAM B"];
  originalRules: string[] = [
    "SING A SONG", "10 PUSH-UPS", "TELL A JOKE", "SHARE A STORY",
    "DANCE 30 SEC", "IMITATE SOMEONE", "POST STORY ONLINE",
    "PRETEND TO BE A ROBOT", "ARM WRESTLE LEFT", "STAND ON ONE LEG",
    "EAT MYSTERY FOOD","DO 15 JUMPING JACKS","RECITE A POEM",
    "MIMIC AN ANIMAL","HUM A TUNE", "DO A CARTWHEEL",
    "SAY TONGUE TWISTER","MAKE A SILLY FACE","CALL A FRIEND",
    "TELL A GHOST STORY",
    "BALANCE AN OBJECT","SING BACKWARDS", "DO 5 BURPEES",
    "TELL A RIDDLE","ACT OUT A MOVIE","HOP ON ONE FOOT",
    "MAKE UP A RAP","WEAR SOCKS ON HANDS", "GUESS THE SONG",
    "DO A HANDSTAND","TELL A FUN FACT","RUN IN PLACE",
    "MAKE A PAPER PLANE","SING OPERA STYLE","DO A SQUAT CHALLENGE",
    "IMITATE A CELEBRITY","BLINDFOLD DRAWING",
    "SPELL NAME BACKWARDS","DO A FUNNY WALK","SING IN SLOW MOTION",
    "MAKE A GROUP CHEER","SING A DUET", "DO A SILENT ACT",
    
  ];
  rules: string[] = ["?", "?", "?", "?", "?", "?", "?", "?", "?", "?", "?"];
  currentResult: string = "CLICK SPIN TO START!";
  isSpinning: boolean = false;
  spinTime: number = 0;
  wheelAngle: number = 0;
  spinDuration: number = 3.0;
  lastSpinTime: number = 0;
  buttonScale: number = 1.0;
  pointerAngle: number = 0;

  // UI dimensions
  wheelRadius: number = 0;
  buttonWidth: number = 0;
  wheelCenter: { x: number, y: number } = { x: 0, y: 0 };
  spinButton: { x: number, y: number, width: number, height: number } = { x: 0, y: 0, width: 0, height: 0 };
  resultBg: { x: number, y: number, width: number, height: number } = { x: 0, y: 0, width: 0, height: 0 };

  // Colors
  BLACK: string = '#000000';
  WHITE: string = '#FFFFFF';
  GOLD: string = '#F1C40F';
  PURPLE: string = '#8E44AD';
  ORANGE: string = '#E67E22';
  GREEN: string = '#2ECC71';
  GRAY: string = '#969696';
  DARK_PURPLE: string = '#2C1A3E';

  // Fonts
  titleFontSize: number = 0;
  mainFontSize: number = 0;
  buttonFontSize: number = 0;
  ruleFontSize: number = 0;

  // Particle effects
  particles: { x: number, y: number, radius: number, alpha: number, speed: number }[] = [];

  ngAfterViewInit(): void {
    const canvas = this.gameCanvas.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.updateCanvasSize();
    this.setupUI();
    this.setupParticles();
    this.run();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateCanvasSize();
    this.setupUI();
    this.draw();
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    const mousePos = this.getMousePos(event);
    if (!this.isSpinning && this.isPointInRect(mousePos, this.spinButton)) {
      this.spin();
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.draw();
  }

  updateCanvasSize(): void {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    const canvas = this.gameCanvas.nativeElement;
    canvas.width = this.screenWidth;
    canvas.height = this.screenHeight;
  }

  setupUI(): void {
    this.wheelRadius = Math.min(this.screenWidth, this.screenHeight) * 0.35;
    this.buttonWidth = Math.min(400, this.screenWidth * 0.7);

    this.titleFontSize = this.screenHeight * 0.12;
    this.mainFontSize = this.screenHeight * 0.07;
    this.buttonFontSize = this.screenHeight * 0.05;
    this.ruleFontSize = this.screenHeight * 0.025;

    // Position the wheel further below the title
    const titleHeight = this.titleFontSize;
    const padding = 30; // Increased padding for more space between title and wheel
    this.wheelCenter = { 
      x: this.screenWidth / 2, 
      y: 1 + titleHeight + padding + this.wheelRadius // Move wheel further below title
    };

    this.spinButton = {
      x: this.screenWidth / 2 - this.buttonWidth / 2,
      y: this.screenHeight - 100,
      width: this.buttonWidth,
      height: 60
    };
    this.resultBg = {
      x: this.screenWidth / 2 - this.buttonWidth / 1.5,
      y: this.screenHeight - 200, // Keep above spin button
      width: this.buttonWidth * 1.2,
      height: 80
    };
  }

  setupParticles(): void {
    this.particles = [];
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: Math.random() * this.screenWidth,
        y: Math.random() * this.screenHeight,
        radius: Math.random() * 3 + 1,
        alpha: Math.random(),
        speed: Math.random() * 0.5 + 0.2
      });
    }
  }

  spin(): void {
    const currentTime = performance.now() / 1000;
    if (!this.isSpinning && currentTime - this.lastSpinTime > 1.0) {
      this.isSpinning = true;
      this.spinTime = performance.now();
      this.currentResult = "SPINNING...";
    }
  }

  update(): void {
    if (this.isSpinning) {
      const elapsed = (performance.now() - this.spinTime) / 1000;
      let speed: number;
      if (elapsed < this.spinDuration * 0.3) {
        speed = 50 * (elapsed / (this.spinDuration * 0.3));
      } else if (elapsed < this.spinDuration * 0.7) {
        speed = 50;
      } else {
        speed = 50 * (1 - (elapsed - this.spinDuration * 0.3) / (this.spinDuration * 0.3));
      }

      this.wheelAngle = (this.wheelAngle + speed) % 360;

      if (elapsed > this.spinDuration) {
        this.isSpinning = false;
        this.lastSpinTime = performance.now() / 1000;
        this.currentResult = this.originalRules[Math.floor(Math.random() * this.originalRules.length)];
      }
    }

    // Update particles
    this.particles.forEach(p => {
      p.y += p.speed;
      p.alpha = Math.sin((p.y / this.screenHeight) * Math.PI);
      if (p.y > this.screenHeight) {
        p.y = 0;
        p.x = Math.random() * this.screenWidth;
      }
    });

    // Button animation
    if (!this.isSpinning) {
      this.buttonScale = 1.0 + Math.sin(performance.now() / 300) * 0.05;
    } else {
      this.buttonScale = 1.0;
    }

    // Pointer animation
    this.pointerAngle = Math.sin(performance.now() / 500) * 5;
  }

  draw(): void {
    this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);

    // Radial gradient background
    const gradient = this.ctx.createRadialGradient(
      this.screenWidth / 2, this.screenHeight / 2, 0,
      this.screenWidth / 2, this.screenHeight / 2, Math.max(this.screenWidth, this.screenHeight)
    );
    gradient.addColorStop(0, this.DARK_PURPLE);
    gradient.addColorStop(1, this.BLACK);
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

    // Particles
    this.particles.forEach(p => {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 215, 0, ${p.alpha})`;
      this.ctx.fill();
    });

    // Title
    const titleText = this.getText(this.titleFontSize + 'px Poppins', "ROULETTE GAME", this.GOLD);
    this.ctx.drawImage(titleText, this.screenWidth / 2 - (titleText as HTMLCanvasElement).width / 2, 1);

    // Draw wheel with gradient segments
    const segmentAngle = 360 / this.rules.length;
    for (let i = 0; i < this.rules.length; i++) {
      const angle = (i * segmentAngle + this.wheelAngle) * Math.PI / 180;
      const nextAngle = ((i + 1) * segmentAngle + this.wheelAngle) * Math.PI / 180;
      const gradient = this.ctx.createLinearGradient(
        this.wheelCenter.x + Math.cos(angle) * this.wheelRadius,
        this.wheelCenter.y + Math.sin(angle) * this.wheelRadius,
        this.wheelCenter.x + Math.cos(nextAngle) * this.wheelRadius,
        this.wheelCenter.y + Math.sin(nextAngle) * this.wheelRadius
      );
      gradient.addColorStop(0, i % 2 === 0 ? '#9B59B6' : '#F39C12');
      gradient.addColorStop(1, i % 2 === 0 ? '#7D3C98' : '#D35400');

      this.ctx.beginPath();
      this.ctx.moveTo(this.wheelCenter.x, this.wheelCenter.y);
      this.ctx.lineTo(
        this.wheelCenter.x + Math.cos(angle) * this.wheelRadius,
        this.wheelCenter.y + Math.sin(angle) * this.wheelRadius
      );
      this.ctx.lineTo(
        this.wheelCenter.x + Math.cos(nextAngle) * this.wheelRadius,
        this.wheelCenter.y + Math.sin(nextAngle) * this.wheelRadius
      );
      this.ctx.closePath();
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
      this.ctx.strokeStyle = this.BLACK;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      this.ctx.shadowColor = i % 2 === 0 ? '#9B59B6' : '#F39C12';
      this.ctx.shadowBlur = 10;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      // Rule text (rotated, bold, with shadow) remains "?"
      const textAngle = angle + (nextAngle - angle) / 2;
      const textPos = {
        x: this.wheelCenter.x + Math.cos(textAngle) * (this.wheelRadius * 0.7),
        y: this.wheelCenter.y + Math.sin(textAngle) * (this.wheelRadius * 0.7)
      };
      this.ctx.save();
      this.ctx.translate(textPos.x, textPos.y);
      this.ctx.rotate(textAngle + Math.PI / 2);
      const ruleText = this.getText(this.ruleFontSize + 'px Poppins', this.rules[i], this.WHITE);
      this.ctx.shadowColor = this.BLACK;
      this.ctx.shadowBlur = 5;
      this.ctx.drawImage(
        ruleText,
        -(ruleText as HTMLCanvasElement).width / 2,
        -(ruleText as HTMLCanvasElement).height / 2
      );
      this.ctx.shadowBlur = 0;
      this.ctx.restore();
    }

    // Wheel border
    this.ctx.beginPath();
    this.ctx.arc(this.wheelCenter.x, this.wheelCenter.y, this.wheelRadius + 5, 0, Math.PI * 2);
    const borderGradient = this.ctx.createLinearGradient(
      this.wheelCenter.x - this.wheelRadius, this.wheelCenter.y - this.wheelRadius,
      this.wheelCenter.x + this.wheelRadius, this.wheelCenter.y + this.wheelRadius
    );
    borderGradient.addColorStop(0, '#FFD700');
    borderGradient.addColorStop(1, '#FFA500');
    this.ctx.strokeStyle = borderGradient;
    this.ctx.lineWidth = 10;
    this.ctx.stroke();

    // Draw pointer with gradient and animation
    const pointerGradient = this.ctx.createLinearGradient(
      this.wheelCenter.x - 20, this.wheelCenter.y - this.wheelRadius - 20,
      this.wheelCenter.x + 20, this.wheelCenter.y - this.wheelRadius
    );
    pointerGradient.addColorStop(0, '#FFD700');
    pointerGradient.addColorStop(1, '#FFA500');
    this.ctx.save();
    this.ctx.translate(this.wheelCenter.x, this.wheelCenter.y - this.wheelRadius - 10);
    this.ctx.rotate((this.pointerAngle * Math.PI) / 180);
    this.ctx.beginPath();
    this.ctx.moveTo(0, -10);
    this.ctx.lineTo(-20, 10);
    this.ctx.lineTo(20, 10);
    this.ctx.closePath();
    this.ctx.fillStyle = pointerGradient;
    this.ctx.fill();
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    this.ctx.shadowBlur = 10;
    this.ctx.fill();
    this.ctx.shadowBlur = 0;
    this.ctx.restore();

    // Result display
    const resultGradient = this.ctx.createLinearGradient(
      this.resultBg.x, this.resultBg.y,
      this.resultBg.x + this.resultBg.width, this.resultBg.y + this.resultBg.height
    );
    resultGradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
    resultGradient.addColorStop(1, 'rgba(44, 26, 62, 0.9)');
    this.drawRoundedRect(this.resultBg.x, this.resultBg.y, this.resultBg.width, this.resultBg.height, 15);
    this.ctx.fillStyle = resultGradient;
    this.ctx.fill();
    this.ctx.strokeStyle = this.GOLD;
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
    this.ctx.shadowColor = this.GOLD;
    this.ctx.shadowBlur = 20;
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;

    const resultText = this.getText(this.mainFontSize + 'px Poppins', this.currentResult, this.WHITE);
    this.ctx.drawImage(resultText, this.screenWidth / 2 - (resultText as HTMLCanvasElement).width / 2, this.resultBg.y + 20);

    // Spin button
    const mousePos = this.getMousePos();
    const hovered = this.isPointInRect(mousePos, this.spinButton);
    const buttonColor = this.isSpinning ? this.GRAY : (hovered ? '#38E07B' : this.GREEN);
    const buttonGradient = this.ctx.createLinearGradient(
      this.spinButton.x, this.spinButton.y,
      this.spinButton.x, this.spinButton.y + this.spinButton.height
    );
    buttonGradient.addColorStop(0, hovered ? '#38E07B' : this.GREEN);
    buttonGradient.addColorStop(1, hovered ? this.GREEN : '#27AE60');

    this.ctx.save();
    this.ctx.translate(this.spinButton.x + this.spinButton.width / 2, this.spinButton.y + this.spinButton.height / 2);
    this.ctx.scale(this.buttonScale, this.buttonScale);
    this.drawRoundedRect(
      -this.spinButton.width / 2,
      -this.spinButton.height / 2,
      this.spinButton.width,
      this.spinButton.height,
      25
    );
    this.ctx.fillStyle = buttonGradient;
    this.ctx.fill();
    this.ctx.strokeStyle = this.WHITE;
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
    this.ctx.shadowColor = this.GREEN;
    this.ctx.shadowBlur = 15;
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    this.ctx.shadowOffsetX = 5;
    this.ctx.shadowOffsetY = 5;
    this.ctx.fill();
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    this.ctx.shadowBlur = 0;
    this.ctx.restore();

    const spinText = this.getText(this.buttonFontSize + 'px Poppins', this.isSpinning ? "SPINNING..." : "SPIN", this.WHITE);
    this.ctx.drawImage(spinText, this.screenWidth / 2 - (spinText as HTMLCanvasElement).width / 2, this.screenHeight - 70);
  }

  run(): void {
    const animate = () => {
      this.update();
      this.draw();
      requestAnimationFrame(animate);
    };
    animate();
  }

  private drawRoundedRect(x: number, y: number, width: number, height: number, radius: number): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.arcTo(x + width, y, x + width, y + height, radius);
    this.ctx.arcTo(x + width, y + height, x, y + height, radius);
    this.ctx.arcTo(x, y + height, x, y, radius);
    this.ctx.arcTo(x, y, x + width, y, radius);
    this.ctx.closePath();
  }

  private getMousePos(event?: MouseEvent): { x: number, y: number } {
    const rect = this.gameCanvas.nativeElement.getBoundingClientRect();
    return event ? { x: event.clientX - rect.left, y: event.clientY - rect.top } : { x: 0, y: 0 };
  }

  private isPointInRect(point: { x: number, y: number }, rect: { x: number, y: number, width: number, height: number }): boolean {
    return point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.y + rect.height;
  }

  private getText(font: string, text: string, color: string): CanvasImageSource {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.font = `bold ${font}`; // Added bold for better visibility
    const width = tempCtx.measureText(text).width;
    const height = parseInt(font) || 32;
    tempCanvas.width = width;
    tempCanvas.height = height;
    tempCtx.font = `bold ${font}`;
    tempCtx.fillStyle = color;
    tempCtx.fillText(text, 0, height - 8);
    return tempCanvas;
  }
}