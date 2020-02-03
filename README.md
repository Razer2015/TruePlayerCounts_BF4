# Battlefield 4 True Player Counts (BBLog plugin)

## New version of Better Battlelog plugin with enhanced version of this plugin (preferred)
### Chrome
Plugin: https://chrome.google.com/webstore/detail/better-battlelog-fixbblog/ncopbeadajoekpedjllcakdmbmgnfgph  
Source: https://github.com/Razer2015/better-battlelog/tree/master/extensions/chrome

### FireFox
Plugin: https://addons.mozilla.org/en-US/firefox/addon/better-battlelog-fix-bblog/  
Source: https://github.com/Razer2015/better-battlelog/tree/master/extensions/firefox

## With older version of Better Battlelog
### Instructions
1. Make sure you have **More Sorts and Information in Serverbrowser** enabled from under Battlefield 4
![MoreSortsAndInfo](https://cdn.discordapp.com/attachments/269780858272088064/457632486172655627/unknown.png)

2. Add the plugin with one of the following methods.

#### Always latest (cdn might be updated slowly though)
https://cdn.jsdelivr.net/gh/Razer2015/TruePlayerCounts_BF4@master/truePlayerCounts.js

#### Specific version
Version 2.4: https://cdn.jsdelivr.net/gh/Razer2015/TruePlayerCounts_BF4@2.4/truePlayerCounts.js

Version 2.3: https://cdn.jsdelivr.net/gh/Razer2015/TruePlayerCounts_BF4@2.3/truePlayerCounts.js

Version 2.2: https://cdn.jsdelivr.net/gh/Razer2015/TruePlayerCounts_BF4@2.2/truePlayerCounts.js

Version 2.1: https://cdn.jsdelivr.net/gh/Razer2015/TruePlayerCounts_BF4@2.1/truePlayerCounts.js

![pluginsadding](https://user-images.githubusercontent.com/10619845/41501560-a30118ec-71af-11e8-896b-61d06846e489.PNG)

# Changelog
```
Version: 2.4
- Added: Check if the trueplayercount from BBLog fix is enabled. (Russao)
Version: 2.3
- Added: Support sorting server list by true player count (contributor: https://github.com/taskula)
Version: 2.2
- Fix: Reverted back to using keeper instead of serverbrowserwarsaw
Version: 2.1
- Fix: Stop excessive request flooding (hopefully :))
- Fix: Fix match info and scoreboard on battlelog (Thanks DICE for breaking them). And thanks PolloLoco for pointing out that https works even though http doesn't
Version: 2.0
- Change: Fetch data from another place (Code refactored quite drastically as well)
Version: 1.3.1
- Fix: Made ajax request async so it won't hang the whole site when the request doesn't work
Version: 1.3
- Added: Color coding on low, mid, high difference of the player count shown/the actual ones playing.
- Added: Option to remove spectators/commanders if there are none. This is to trim down the view.
Version: 1.1
- Fixed a bug that prevented automatic loading on page load (Worked from the Editor but not when uploaded).
Version: 1.0
- Initial release
```
# ~~Alternatives~~
~~If you don't want to install this plugin but want to get battlelog fixed, here is the Battlelog keeper fixer
https://greasyfork.org/en/scripts/369636-battlelog-keeper-fixer~~

Has been fixed by DICE now so no need for this anymore.

# Previews
![serverbrowser](https://user-images.githubusercontent.com/10619845/41501559-9d87c622-71af-11e8-803d-c25c891ee4e9.PNG)

Older versions in gist: https://gist.github.com/Razer2015/655840e3455c59c147d133532a631634
