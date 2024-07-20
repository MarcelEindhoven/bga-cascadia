Cascadia is a puzzly tile-laying and token-drafting game featuring the habitats and wildlife of the Pacific Northwest.

In the game, you take turns building out your own terrain area and populating it with wildlife. You start with three hexagonal habitat tiles (with the five types of habitat in the game), and on a turn you choose a new habitat tile that's paired with a wildlife token, then place that tile next to your other ones and place the wildlife token on an appropriate habitat. (Each tile depicts 1-3 types of wildlife from the five types in the game, and you can place at most one tile on a habitat.) Four tiles are on display, with each tile being paired at random with a wildlife token, so you must make the best of what's available — unless you have a nature token to spend so that you can pick your choice of each item.

Ideally you can place habitat tiles to create matching terrain that reduces fragmentation and creates wildlife corridors, mostly because you score for the largest area of each type of habitat at game's end, with a bonus if your group is larger than each other player's. At the same time, you want to place wildlife tokens so that you can maximize the number of points scored by them, with the wildlife goals being determined at random by one of the four scoring cards for each type of wildlife. Maybe hawks want to be separate from other hawks, while foxes want lots of different animals surrounding them and bears want to be in pairs. Can you make it happen?


## GitHub
git clone https://github.com/MarcelEindhoven/bga-verdant.git
git config user.email "Marcel.Eindhoven@Gmail.com"
git config user.name "MarcelEindhoven"

## Development site boardgame arena:
user MarcelEindhoven0
https://studio.boardgamearena.com/controlpanel
https://studio.boardgamearena.com/studio
https://studio.boardgamearena.com/studiogame?game=cascadiacannonfodder

## Development environment
### PHP
Installing PHP is tricky. For example, you cannot simply install PHP in "Program Files" because that directory name contains a space.
The messages you get assume you are already an expert in PHP terminology.

PHP version of BGA according to phpversion(): 7.4.3-4ubuntu2.180
Corresponding PHPunit version: 9


First download a PHP package without words like debug, develop or test in the package name. Possibly useful links
- https://www.sitepoint.com/how-to-install-php-on-windows/
- https://windows.php.net/downloads/releases/php-7.4.33-Win32-vc15-x64.zip
- https://www.ionos.com/digitalguide/server/configuration/php-composer-installation-on-windows-10/

Next version will be 8.2

### Composer
When PHP is available in the PATH, installation is straightforward
- https://getcomposer.org/Composer-Setup.exe
- In the git directory, type "composer install" to download all PHP packages into the vendor directory

### Visual studio code
Install visual studio code (https://code.visualstudio.com/docs?dv=win)

Extensions:
- PHP Intelephense 
- HTML CSS Support
- StandardJS - JavaScript Standard Style
- Git History
- Git Tree Compare
- GitHub Pull Requests and Issues
- Compare Folders
- Markdown plantUML
- Print

### JavaScript unit testing
To install Mocha, first install npm and node js

npm install --save-dev mocha
npm install --save-dev sinon
npm install --save-dev dojo
npm install --save-dev amd-loader

package.json add test script
npm test

### PHP unit testing
./test.bat
