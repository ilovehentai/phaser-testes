/// <reference types="Phaser" />
export declare class Play extends Phaser.Scene {
    private jumpSound;
    private coinSound;
    private deadSound;
    private player;
    private coin;
    private scoreLabel;
    private rotateLabel;
    private arrow;
    private enemies;
    private emitter;
    private score;
    private nextEnemy;
    private walls;
    private moveLeft;
    private moveRight;
    create(): void;
    update(): void;
    createWorld(): void;
    movePlayer(): void;
    takeCoin(): void;
    updateCoinPosition(): void;
    addEnemy(): void;
    playerDie(): void;
    addMobileInputs(): void;
    jumpPlayer(): void;
    orientationChange(): void;
}
