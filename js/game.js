const BootScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize:
    function BootScene() {
      Phaser.Scene.call(this, { key: 'BootScene' });
    },

  preload: function () {
    this.load.image('tiles', 'assets/map/spritesheet.png');
    this.load.tilemapTiledJSON('map', 'assets/map/map.json');
    this.load.spritesheet('player', 'assets/RPG_assets.png', { frameWidth: 16, frameHeight: 16 });
    this.load.image('dragonblue', 'assets/dragonblue.png');
    this.load.image('dragonorange', 'assets/dragonorange.png');
  },

  create: function () {
    this.scene.switch('TitleScene');
  }
});

const TitleScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize:
    function TitleScene() {
      Phaser.Scene.call(this, { key: 'TitleScene' });
    },

  preload: function () {
    this.load.image('bg', 'assets/bgCastle.png');
  },

  create: function () {
    const background = this.add.sprite(0, 0, 'bg')
    background.setOrigin(0, 0);

    const title = this.add.text(55, 100, 'Stackathon RPG', { fontSize: 25 });
    const startTitleText = this.add.text(80, 200, "Press 'Enter' to start", { fontSize: 12 })

    this._cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown', this.onKeyInput, this);
  },

  onKeyInput: function (event) {
    if (event.code === 'Enter') {
      this.scene.switch('IntroScene')
    }
  }
});

const IntroScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize:
    function IntroScene() {
      Phaser.Scene.call(this, { key: 'IntroScene' });
    },

  preload: function () {

  },

  create: function () {
    const background = this.add.sprite(0, 0, 'bg');
    background.setOrigin(0, 0);

    const story = this.add.text(100, 20, 'Story:', { fontSize: 25 });
    const instructions = this.add.text(55, 100, 'The castle is under attack by dragons! You and the other most noble knights in the kingdom have been dispatched to defeat all of the enemies in the surrounding area.', { fontSize: 12, wordWrap: { width: 200, useAdvancedWrap: true } });

    this.__cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown', this.onKeyInput, this);
  },

  onKeyInput: function (event) {
    if (event.code === 'Enter') {
      this.scene.sleep('IntroScene');
      this.scene.switch('CastleScene')
    }
  }
})

const CastleScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize:
    function CastleScene() {
      Phaser.Scene.call(this, { key: 'CastleScene' });
    },

  preload: function () {
    this.load.image('castle', '/assets/16castle.png')
  },

  create: function () {
    const background = this.add.sprite(0, 0, 'castle');
    background.setOrigin(0, 0);

    //create player sprite
    this.player = this.physics.add.sprite(160, 180, 'player', 3);
    this._cursors = this.input.keyboard.createCursorKeys();

    //animate player movement
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', { frames: [4, 10, 4, 16] }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { frames: [4, 10, 4, 16] }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('player', { frames: [5, 11, 5, 17] }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('player', { frames: [3, 9, 3, 15] }),
      frameRate: 10,
      repeat: -1
    });

    //add exit
    this.exitzone = this.physics.add.group({
      classType: Phaser.GameObjects.Zone
    });
    const x = 150
    const y = 220
    this.exitzone.create(x, y, 20, 20);
  },

  update: function (time, delta) {
    //set player movement
    this.player.body.setVelocity(0);
    if (this._cursors.left.isDown) {
      this.player.body.setVelocityX(-80);
    }
    else if (this._cursors.right.isDown) {
      this.player.body.setVelocityX(80);
    }
    if (this._cursors.up.isDown) {
      this.player.body.setVelocityY(-80);
    }
    else if (this._cursors.down.isDown) {
      this.player.body.setVelocityY(80);
    }

    //animate player movement
    if (this._cursors.left.isDown) {
      this.player.anims.play('left', true);
      this.player.flipX = true;
    }
    else if (this._cursors.right.isDown) {
      this.player.anims.play('right', true);
      this.player.flipX = false;
    }
    else if (this._cursors.up.isDown) {
      this.player.anims.play('up', true);
    }
    else if (this._cursors.down.isDown) {
      this.player.anims.play('down', true);
    }
    else {
      this.player.anims.stop();
    }

    this.physics.add.collider(this.player, this.exitzone, this.onCastleExit, false, this);
  },

  onCastleExit: function (player, zone) {
    //flash map on exit
    this.cameras.main.flash();

    //start the battle
    this.scene.switch('WorldScene');
  }
});

const TownScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize:
    function TownScene () {
      Phaser.Scene.call(this, { key: 'TownScene' });
    },

  preload: function () {
    this.load.image('town', '/assets/town.png')
  },

  create: function () {
    const background = this.add.sprite(0, 0, 'town');
    background.setOrigin(0, 0);

    //create player sprite
    this.player = this.physics.add.sprite(310, 180, 'player', 4);
    this.player.flipX = true;
    this._cursors = this.input.keyboard.createCursorKeys();

    //animate player movement
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', { frames: [4, 10, 4, 16] }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { frames: [4, 10, 4, 16] }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('player', { frames: [5, 11, 5, 17] }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('player', { frames: [3, 9, 3, 15] }),
      frameRate: 10,
      repeat: -1
    });

    //add exit
    this.exitTownZone = this.physics.add.group({
      classType: Phaser.GameObjects.Zone
    });
    const x = 200
    const y = 5
    this.exitTownZone.create(x, y, 20, 20);
  },

  update: function (time, delta) {
    //set player movement
    this.player.body.setVelocity(0);
    if (this._cursors.left.isDown) {
      this.player.body.setVelocityX(-80);
    }
    else if (this._cursors.right.isDown) {
      this.player.body.setVelocityX(80);
    }
    if (this._cursors.up.isDown) {
      this.player.body.setVelocityY(-80);
    }
    else if (this._cursors.down.isDown) {
      this.player.body.setVelocityY(80);
    }

    //animate player movement
    if (this._cursors.left.isDown) {
      this.player.anims.play('left', true);
      this.player.flipX = true;
    }
    else if (this._cursors.right.isDown) {
      this.player.anims.play('right', true);
      this.player.flipX = false;
    }
    else if (this._cursors.up.isDown) {
      this.player.anims.play('up', true);
    }
    else if (this._cursors.down.isDown) {
      this.player.anims.play('down', true);
    }
    else {
      this.player.anims.stop();
    }

    this.physics.add.collider(this.player, this.exitTownZone, this.onTownExit, false, this);
  },

  onTownExit: function (player, zone) {
    //flash map on exit
    this.cameras.main.flash();

    //start the battle
    this.scene.switch('WorldScene');
  }
})

const WorldScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize:
    function WorldScene() {
      Phaser.Scene.call(this, { key: 'WorldScene' });
    },

  preload: function () {
    this.load.image('worldcastle', '/assets/worldcastle.png')
    this.load.image('worldtown', '/assets/worldtown.png')
    this.load.image('grass', '/assets/grass1.png')
  },

  create: function () {
    this.anims.remove('left');
    this.anims.remove('down');
    this.anims.remove('up');
    this.anims.remove('right');

    //create map tiles
    const map = this.make.tilemap({ key: 'map' });
    const tiles = map.addTilesetImage('spritesheet', 'tiles');
    //const grass = map.createStaticLayer('Grass', tiles, 0, 0);
    const background = this.add.sprite(0, 0, 'grass');
    background.setOrigin(0, 0);
    const obstacles = map.createStaticLayer('Obstacles', tiles, 0, 0);
    obstacles.setCollisionByExclusion([-1]);

    //create world castle
    this.add.sprite(220, 150, 'worldcastle');

    //create world town
    this.add.sprite(40, 270, 'worldtown');

    //create player sprite
    this.player = this.physics.add.sprite(220, 180, 'player', 3);
    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;
    this.player.setCollideWorldBounds(true);
    this.cursors = this.input.keyboard.createCursorKeys();

    //make the camera move
    this.cameras.main.setBounds(0, 0, map.widthinPixels, map.heightinPixels);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.roundPixels = true;

    //animate player movement
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', { frames: [4, 10, 4, 16] }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { frames: [4, 10, 4, 16] }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('player', { frames: [5, 11, 5, 17] }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('player', { frames: [3, 9, 3, 15] }),
      frameRate: 10,
      repeat: -1
    });

    //make player collide with obstacles
    this.physics.add.collider(this.player, obstacles);

    //add enemy zones
    this.spawns = this.physics.add.group({
      classType: Phaser.GameObjects.Zone
    });
    for (let i = 0; i < 10; i++) {
      const x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
      const y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
      this.spawns.create(x, y, 20, 20);
    };
    this.physics.add.overlap(this.player, this.spawns, this.onMeetEnemy, false, this);
    this.sys.events.on('wake', this.wake, this);
  },

  update: function (time, delta) {
    //set player movement
    this.player.body.setVelocity(0);
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-80);
    }
    else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(80);
    }
    if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-80);
    }
    else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(80);
    }

    //animate player movement
    if (this.cursors.left.isDown) {
      this.player.anims.play('left', true);
      this.player.flipX = true;
    }
    else if (this.cursors.right.isDown) {
      this.player.anims.play('right', true);
      this.player.flipX = false;
    }
    else if (this.cursors.up.isDown) {
      this.player.anims.play('up', true);
    }
    else if (this.cursors.down.isDown) {
      this.player.anims.play('down', true);
    }
    else {
      this.player.anims.stop();
    }

    //   //add zone to re-enter castle
    //   this.entercastlezone = this.physics.add.group({
    //     classType: Phaser.GameObjects.Zone
    //   });
    //   const x = 170
    //   const y = 50
    //   this.entercastlezone.create(x, y, 20, 20);
    //   this.physics.add.collider(this.player, this.entercastlezone, this.onEnterCastle, false, this);
    // },

    // onEnterCastle: function () {
    //   this.scene.switch('CastleScene');

    this.entertownzone = this.physics.add.group({
          classType: Phaser.GameObjects.Zone
        });
        const x = 60
        const y = 280


        this.entertownzone.create(x, y, 20, 20);
        this.physics.add.collider(this.player, this.entertownzone, this.onEnterTown, false, this);
      },

      onEnterTown: function () {
        this.scene.switch('TownScene');
  },

  //battle
  onMeetEnemy: function (player, zone) {
    //move the zone to a new location
    // zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
    // zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
    zone.destroy();

    //shake map on meet
    this.cameras.main.flash();

    //start the battle
    this.scene.switch('BattleScene');
  },

  wake: function () {
    this.cursors.left.reset();
    this.cursors.right.reset();
    this.cursors.up.reset();
    this.cursors.down.reset();
  }
});

const Unit = new Phaser.Class({
  Extends: Phaser.GameObjects.Sprite,
  initialize:
    function Unit(scene, x, y, texture, frame, type, hp, damage) {
      Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame);
      this.type = type;
      this.maxHp = this.hp = hp;
      this.damage = damage;
      this.living = true;
      this.menuItem = null;
    },

  //notifies menu if unit is dead
  setMenuItem: function (item) {
    this.menuItem = item;
  },

  attack: function (target) {
    if (target.living) {
      target.takeDamage(this.damage);
      this.scene.events.emit('Message', this.type + ' attacks ' + target.type + ' for ' + this.damage + ' damage');
    }
  },

  takeDamage: function (damage) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.hp = 0;
      this.menuItem.unitKilled();
      this.living = false;
      this.visible = false;
      this.menuItem = null;
    }
  }
});

const EnemyUnit = new Phaser.Class({
  Extends: Unit,
  initialize:
    function EnemyUnit(scene, x, y, texture, frame, type, hp, damage) {
      Unit.call(this, scene, x, y, texture, frame, type, hp, damage)
    }
});

const PlayerUnit = new Phaser.Class({
  Extends: Unit,
  initialize:
    function PlayerUnit(scene, x, y, texture, frame, type, hp, damage) {
      Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
      this.flipX = true;
      this.setScale(2);
    }
})

const BattleScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize:
    function BattleScene() {
      Phaser.Scene.call(this, { key: 'BattleScene' });
    },

  preload: function () {
    this.load.image('battle-bg', '/assets/battle-bg.png')
  },

  create: function () {
    const background = this.add.sprite(0, 0, 'battle-bg')
    background.setOrigin(0, 0)
    //this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)');

    this.startBattle();

    //listen to the scene wake event
    this.sys.events.on('wake', this.startBattle, this);
  },

  nextTurn: function () {
    if (this.checkEndBattle()) {
      this.endBattle();
      return;
    }

    do {
      this.index++;
      if (this.index >= this.units.length) {
        this.index = 0;
      }
    } while (!this.units[this.index].living);

    if (this.units[this.index] instanceof PlayerUnit) {
      this.events.emit('PlayerSelect', this.index);
    } else { // if enemy unit
      let r;
      do {
        r = Math.floor(Math.random() * this.players.length);
      } while (!this.players[r].living)
      this.units[this.index].attack(this.players[r]);
      this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
    }
  },

  receivePlayerSelection: function (action, target) {
    if (action === 'attack') {
      this.units[this.index].attack(this.enemies[target]);
    }
    this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
  },

  exitBattle: function () {
    this.scene.sleep('UIScene');
    this.scene.switch('WorldScene');
  },

  wake: function () {
    this.scene.run('UIScene');
    this.time.addEvent({ delay: 2000, callback: this.exitBattle, callbackScope: this });
  },

  checkEndBattle: function () {
    let victory = true;
    for (let i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].living) {
        victory = false;
      };
    };

    let gameOver = true;
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].living) {
        gameOver = false;
      }
    };

    return victory || gameOver;
  },

  endBattle: function () {
    this.players.length = 0;
    this.enemies.length = 0;
    for (let i = 0; i < this.units.length; i++) {
      this.units[i].destroy();
    };
    this.units.length = 0;
    this.scene.sleep('UIScene');
    this.scene.switch('WorldScene');
  },

  startBattle: function () {
    //player units
    const warrior = new PlayerUnit(this, 250, 50, 'player', 4, 'Hero', 100, 20);
    this.add.existing(warrior);
    const mage = new PlayerUnit(this, 260, 75, 'player', 1, 'Eliot', 80, 8);
    this.add.existing(mage);
    const mage1 = new PlayerUnit(this, 270, 100, 'player', 1, 'Jonathan', 80, 8);
    this.add.existing(mage1);
    const mage2 = new PlayerUnit(this, 280, 125, 'player', 1, 'Preston', 80, 8);
    this.add.existing(mage2);

    //enemy units
    const dragonblue = new EnemyUnit(this, 50, 50, 'dragonblue', null, 'B. Dragon', 50, 3);
    this.add.existing(dragonblue);
    const dragonorange = new EnemyUnit(this, 40, 100, 'dragonorange', null, 'R. Dragon', 50, 3);
    this.add.existing(dragonorange);

    //create player array
    this.players = [warrior, mage, mage1, mage2];

    //create enemy array
    this.enemies = [dragonblue, dragonorange];

    //create all units array
    this.units = this.players.concat(this.enemies);

    //show the currently active unit in the array
    this.index = -1;

    //run scene
    this.scene.launch('UIScene');
  }
});

const UIScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize:
    function UIScene() {
      Phaser.Scene.call(this, { key: 'UIScene' });
    },

  create: function () {
    //battle menu creation
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(1, 0xffffff);
    this.graphics.fillStyle(0x031f4c, 1);
    this.graphics.strokeRect(2, 150, 90, 100);
    this.graphics.fillRect(2, 150, 90, 100);
    this.graphics.strokeRect(95, 150, 90, 100);
    this.graphics.fillRect(95, 150, 90, 100);
    this.graphics.strokeRect(188, 150, 130, 100);
    this.graphics.fillRect(188, 150, 130, 100);

    //add menus to the scene
    this.menus = this.add.container();
    this.playerMenu = new PlayerMenu(195, 153, this);
    this.actionsMenu = new ActionsMenu(100, 153, this);
    this.enemyMenu = new EnemyMenu(8, 153, this);

    //the current menu
    this.currentMenu = this.actionsMenu;

    //add menus to the container
    this.menus.add(this.playerMenu);
    this.menus.add(this.actionsMenu);
    this.menus.add(this.enemyMenu);

    //get BattleScene
    this.battleScene = this.scene.get('BattleScene');

    //add listener events to menu
    this.input.keyboard.on('keydown', this.onKeyInput, this);

    this.battleScene.events.on('PlayerSelect', this.onPlayerSelect, this);

    this.events.on('SelectedAction', this.onSelectedAction, this);

    this.events.on('Enemy', this.onEnemy, this);

    this.sys.events.on('wake', this.createMenu, this);

    //add battle messages
    this.message = new Message(this, this.battleScene.events);
    this.add.existing(this.message);

    this.createMenu();
  },

  remapPlayers: function () {
    const players = this.battleScene.players;
    this.playerMenu.remap(players);
  },

  remapEnemies: function () {
    const enemies = this.battleScene.enemies;
    this.enemyMenu.remap(enemies);
  },

  onKeyInput: function (event) {
    if (this.currentMenu && this.currentMenu.selected) {
      if (event.code === 'ArrowUp') {
        this.currentMenu.moveSelectionUp();
      } else if (event.code === 'ArrowDown') {
        this.currentMenu.moveSelectionDown();
      } else if (event.code === 'ArrowRight' || event.code === 'Shift') {

      } else if (event.code === 'Space') {
        this.currentMenu.confirm();
      }
    }
  },

  onPlayerSelect: function (id) {
    this.playerMenu.select(id);
    this.actionsMenu.select(0);
    this.currentMenu = this.actionsMenu;
  },

  onSelectedAction: function () {
    this.currentMenu = this.enemyMenu;
    this.enemyMenu.select(0);
  },

  onEnemy: function (index) {
    this.playerMenu.deselect();
    this.actionsMenu.deselect();
    this.enemyMenu.deselect();
    this.currentMenu = null;
    this.battleScene.receivePlayerSelection('attack', index);
  },

  createMenu: function () {
    this.remapPlayers();
    this.remapEnemies();
    this.battleScene.nextTurn();
  }
});

const MenuItem = new Phaser.Class({
  Extends: Phaser.GameObjects.Text,
  initialize:
    function MenuItem(x, y, text, scene) {
      Phaser.GameObjects.Text.call(this, scene, x, y, text, { color: '#ffffff', align: 'left', fontSize: 15 });
    },

  select: function () {
    this.setColor('#f8ff38');
  },

  deselect: function () {
    this.setColor('#ffffff')
  },

  //when player or enemy unit is killed
  unitKilled: function () {
    this.active = false;
    this.visible = false;
  },
});

const Menu = new Phaser.Class({
  Extends: Phaser.GameObjects.Container,
  initialize:
    function Menu(x, y, scene, players) {
      Phaser.GameObjects.Container.call(this, scene, x, y);
      this.menuItems = [];
      this.menuItemIndex = 0;
      this.x = x;
      this.y = y;
      this.selected = false;
    },

  addMenuItem: function (unit) {
    const menuItem = new MenuItem(0, this.menuItems.length * 20, unit, this.scene);
    this.menuItems.push(menuItem);
    this.add(menuItem);
    return menuItem;
  },

  moveSelectionUp: function () {
    this.menuItems[this.menuItemIndex].deselect();
    do {
      this.menuItemIndex--;
      if (this.menuItemIndex < 0) {
        this.menuItemIndex = this.menuItems.length - 1;
      }
    } while (!this.menuItems[this.menuItemIndex].active);
    this.menuItems[this.menuItemIndex].select();
  },

  moveSelectionDown: function () {
    this.menuItems[this.menuItemIndex].deselect();
    do {
      this.menuItemIndex++;
      if (this.mneuItemIndex >= this.menuItems.length) {
        this.menuItemIndex = 0;
      };
    } while (!this.menuItems[this.menuItemIndex].active);
    this.menuItems[this.menuItemIndex].select();
  },

  select: function (index) {
    if (!index) {
      index = 0;
    };
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = index;
    while (!this.menuItems[this.menuItemIndex].active) {
      this.menuItemIndex++;
      if (this.menuItemIndex >= this.menuItems.length) {
        this.menuItemIndex = 0;
      };
      if (this.menuItemIndex == index) {
        return;
      }
    }
    this.menuItems[this.menuItemIndex].select();
    this.selected = true;
  },

  deselect: function () {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = 0;
    this.selected = false;
  },

  confirm: function () {
    //enter action here
  },

  clear: function () {
    for (let i = 0; i < this.menuItems.length; i++) {
      this.menuItems[i].destroy();
    };
    this.menuItems.length = 0;
    this.menuItemIndex = 0;
  },

  remap: function (units) {
    this.clear();
    for (let i = 0; i < units.length; i++) {
      let unit = units[i];
      unit.setMenuItem(this.addMenuItem(unit.type));
    }
    this.menuItemIndex = 0;
  }
});

const PlayerMenu = new Phaser.Class({
  Extends: Menu,
  initialize:
    function PlayerMenu(x, y, scene) {
      Menu.call(this, x, y, scene);
    }
});

const ActionsMenu = new Phaser.Class({
  Extends: Menu,
  initialize:
    function ActionsMenu(x, y, scene) {
      Menu.call(this, x, y, scene);
      this.addMenuItem('Attack');
    },

  confirm: function () {
    this.scene.events.emit('SelectedAction')
  }
});

const EnemyMenu = new Phaser.Class({
  Extends: Menu,
  initialize:
    function EnemyMenu(x, y, scene) {
      Menu.call(this, x, y, scene);
    },

  confirm: function () {
    this.scene.events.emit('Enemy', this.menuItemIndex);
  }
});

const Message = new Phaser.Class({
  Extends: Phaser.GameObjects.Container,
  initialize:
    function Message(scene, events) {
      Phaser.GameObjects.Container.call(this, scene, 160, 30);
      const graphics = this.scene.add.graphics();
      this.add(graphics);
      graphics.lineStyle(1, 0xffffff, 0.8);
      graphics.fillStyle(0x031f4c, 0.3);
      graphics.strokeRect(-90, -15, 180, 30);
      graphics.fillRect(-90, -15, 180, 30);

      this.text = new Phaser.GameObjects.Text(scene, 0, 0, '', { color: '#ffffff', align: 'center', fontSize: 13, wordWrap: { width: 160, useAdvancedWrap: true } });
      this.add(this.text);
      this.text.setOrigin(0.5);
      events.on('Message', this.showMessage, this);
      this.visible = false;
    },

  showMessage: function (text) {
    this.text.setText(text);
    this.visible = true;
    if (this.hideEvent) {
      this.hideEvent.remove(false);
    }
    this.hideEvent = this.scene.time.addEvent({ delay: 2000, callback: this.hideMessage, callbackScope: this });
  },

  hideMessage: function () {
    this.hideEvent = null;
    this.visible = false;
  }
})

var config = {
  type: Phaser.AUTO,
  parent: 'content',
  width: 320,
  height: 240,
  zoom: 2,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false// set to true to view zones
    }
  },
  scene: [
    BootScene,
    TitleScene,
    IntroScene,
    CastleScene,
    WorldScene,
    TownScene,
    BattleScene,
    UIScene
  ]
};
const game = new Phaser.Game(config);
