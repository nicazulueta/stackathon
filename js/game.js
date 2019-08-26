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
    this.scene.start('WorldScene');
    this.scene.start('BattleScene')
  }
});

const WorldScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize:
    function WorldScene() {
      Phaser.Scene.call(this, { key: 'WorldScene' });
    },

  preload: function () {

  },

  create: function () {
    //create map tiles
    const map = this.make.tilemap({ key: 'map' });
    const tiles = map.addTilesetImage('spritesheet', 'tiles');
    const grass = map.createStaticLayer('Grass', tiles, 0, 0);
    const obstacles = map.createStaticLayer('Obstacles', tiles, 0, 0);
    obstacles.setCollisionByExclusion([-1]);

    //create player sprite
    this.player = this.physics.add.sprite(50, 100, 'player', 10);
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
    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
      const y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
      this.spawns.create(x, y, 20, 20);
    };
    this.physics.add.overlap(this.player, this.spawns, this.onMeetEnemy, false, this);
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
  },

  //battle
  onMeetEnemy: function (player, zone) {
    //move the zone to a new location
    zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
    zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);

    //shake map on meet
    this.cameras.main.flash();

    //start the battle
  }

});

const Unit = new Phaser.Class({
  Extends: Phaser.GameObjects.Sprite,
  initialize:
  function Unit (scene, x, y, texture, frame, type, hp, damage) {
    Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame);
    this.type = type;
    this.maxHp = this.hp = hp;
    this.damage = damage;
  },

  attack: function (target) {
    target.takeDamage(this.damage);
  },
  takeDamage: function (damage) {
    this.hp -= damage;
  }
});

const EnemyUnit = new Phaser.Class({
  Extends: Unit,
  initialize:
  function EnemyUnit (scene, x, y, texture, frame, type, hp, damage) {
    Unit.call(this, scene, x, y, texture, frame, type, hp, damage)
  }
});

const PlayerUnit = new Phaser.Class({
  Extends: Unit,
  initialize:
  function PlayerUnit (scene, x, y, texture, frame, type, hp, damage) {
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

  create: function () {
    this.scene.launch('UIScene');
    this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)')
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

    //battle units creation
    this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)');

    //player units
    const warrior = new PlayerUnit(this, 250, 50, 'player', 4, 'Warrior', 100, 20);
    this.add.existing(warrior);
    const mage = new PlayerUnit(this, 260, 100, 'player', 1, 'Mage', 80, 8);
    this.add.existing(mage);

    //enemy units
    const dragonblue = new EnemyUnit(this, 50, 50, 'dragonblue', null, 'Dragon', 50, 3);
    this.add.existing(dragonblue);
    const dragonorange = new EnemyUnit(this, 40, 100, 'dragonorange', null, 'Dragon2', 50, 3);
    this.add.existing(dragonorange);

    //create player array
    this.players = [ warrior, mage ];

    //create enemy array
    this.enemies = [ dragonblue, dragonorange ];

    //create all units array
    this.units = this.players.concat(this.enemies);

    //run scene
    this.scene.launch('UIScene');

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
  }
});

const MenuItem = new Phaser.Class({
  Extends: Phaser.GameObjects.Text,
  initialize:
  function MenuItem (x, y, text, scene) {
    Phaser.GameObjects.Text.call(this, scene, x, y, text, { color: '#ffffff', align: 'left', fontSize: 15});
  },

  select: function () {
    this.setColor('#f8ff38');
  },

  deselect: function () {
    this.setColor('#ffffff')
  }
});

const Menu = new Phaser.Class({
  Extends: Phaser.GameObjects.Container,
  initialize:
  function Menu (x, y, scene, players) {
    Phaser.GameObjects.Container.call(this, scene, x, y);
    this.menuItems = [];
    this.menuItemIndex = 0;
    this.players = players;
    this.x = x;
    this.y = y;
  },

  addMenuItem: function (unit) {
    const menuItem = new MenuItem(0, this.menuItems.length*20, unit, this.scene);
    this.menuItems.push(menuItem);
    this.add(menuItem);
  },

  moveSelectionUp: function () {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex--;
    if (this.menuItemIndex < 0) {
      this.menuItemIndex = this.menuItems.length - 1;
    };
    this.menuItems[this.menuItemIndex].select();
  },

  moveSelectionDown: function () {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex++;
    if (this.mneuItemIndex >= this.menuItems.length) {
      this.menuItemIndex = 0;
    };
    this.menuItems[this.menuItemIndex].select();
  },

  select: function (index) {
    if (!index) {
      index = 0;
    };
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = index;
    this.menuItems[this.menuItemIndex].select();
  },

  deselect: function () {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = 0;
  },

  confirm: function () {
    //enter action here
  }
});

const PlayerMenu = new Phaser.Class({
  Extends: Menu,
  initialize:
  function PlayerMenu (x, y, scene) {
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
    //enter action here
  }
});

const EnemyMenu = new Phaser.Class({
  Extends: Menu,
  initialize:
  function EnemyMenu(x, y, scene) {
    Menu.call(this, x, y, scene);
  },

  confirm: function () {
    //enter action here
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
      debug: true // set to true to view zones
    }
  },
  scene: [
    BootScene,
    WorldScene,
    BattleScene,
    UIScene
  ]
};
var game = new Phaser.Game(config);
