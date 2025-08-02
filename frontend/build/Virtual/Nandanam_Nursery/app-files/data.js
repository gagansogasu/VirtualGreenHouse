var APP_DATA = {
  "scenes": [
    {
      "id": "0-front-",
      "name": "Front ",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        }
      ],
      "faceSize": 896,
      "initialViewParameters": {
        "yaw": 0.19412335557895588,
        "pitch": 0.015265566047133916,
        "fov": 1.2599180821480807
      },
      "linkHotspots": [
        {
          "yaw": -0.6626296605464628,
          "pitch": -0.022775124414208037,
          "rotation": 0,
          "target": "2-side-1"
        },
        {
          "yaw": 1.1118483358278688,
          "pitch": 0.0701242549886878,
          "rotation": 0,
          "target": "4-side-2"
        },
        {
          "yaw": 0.6343392370508205,
          "pitch": -0.026137579731381422,
          "rotation": 0,
          "target": "3-inside-1"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "1-inside-2",
      "name": "Inside 2",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        }
      ],
      "faceSize": 896,
      "initialViewParameters": {
        "yaw": 1.829033818161407,
        "pitch": 0.007496254398880353,
        "fov": 1.2599180821480807
      },
      "linkHotspots": [
        {
          "yaw": 1.6051756503885892,
          "pitch": -0.006831427389982991,
          "rotation": 0,
          "target": "3-inside-1"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "2-side-1",
      "name": "Side 1",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        }
      ],
      "faceSize": 896,
      "initialViewParameters": {
        "yaw": 0,
        "pitch": 0,
        "fov": 1.2599180821480807
      },
      "linkHotspots": [
        {
          "yaw": 0.6134152078714408,
          "pitch": 0.00963423801061225,
          "rotation": 0,
          "target": "0-front-"
        },
        {
          "yaw": 0.03533327951116405,
          "pitch": -0.047066438293065005,
          "rotation": 0,
          "target": "4-side-2"
        },
        {
          "yaw": -0.8933423455236635,
          "pitch": -0.0737212079146623,
          "rotation": 0,
          "target": "3-inside-1"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "3-inside-1",
      "name": "Inside 1",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        }
      ],
      "faceSize": 896,
      "initialViewParameters": {
        "yaw": -0.7907410080464068,
        "pitch": 0.1704654875263394,
        "fov": 1.2599180821480807
      },
      "linkHotspots": [
        {
          "yaw": -1.0327797811739536,
          "pitch": -0.012256713279267473,
          "rotation": 0,
          "target": "1-inside-2"
        },
        {
          "yaw": 2.3398095786102164,
          "pitch": 0.10427396966130331,
          "rotation": 0,
          "target": "0-front-"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "4-side-2",
      "name": "Side 2",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        }
      ],
      "faceSize": 896,
      "initialViewParameters": {
        "yaw": 0,
        "pitch": 0,
        "fov": 1.2599180821480807
      },
      "linkHotspots": [
        {
          "yaw": -0.17592125425685978,
          "pitch": -0.1241462133947806,
          "rotation": 0,
          "target": "3-inside-1"
        },
        {
          "yaw": -2.0641190031236167,
          "pitch": -0.10400480646460508,
          "rotation": 0,
          "target": "4-side-2"
        },
        {
          "yaw": 2.658657960054474,
          "pitch": -0.06932948417003715,
          "rotation": 0,
          "target": "0-front-"
        }
      ],
      "infoHotspots": []
    }
  ],
  "name": "MG Road",
  "settings": {
    "mouseViewMode": "drag",
    "autorotateEnabled": false,
    "fullscreenButton": true,
    "viewControlButtons": true
  }
};
