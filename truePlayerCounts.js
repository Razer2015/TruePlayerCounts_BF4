/**
* True Player Counts - Shows the true player count on the server (Not the ones in queue/cheating with the bots).
* 
* Used I-MrFixIt-I's Friends Highlighter as a base.
* 
* @author xfileFIN
* @version 2.3
* @url https://getbblog.com
*/

/*************/
/* Changelog */
/*************/
/*
Version: 2.3
- Added: Support sorting server list by true player count (contributor: https://github.com/taskula)
Version: 2.2
- Fix: Reverted back to using keeper instead of serverbrowserwarsaw
Version: 2.1
- Fix: Stop excessive request flooding (hopefully :))
- Fix: Fix match info and scoreboard on battlelog (Thanks DICE for breaking them). And thanks PolloLoco for pointing out that https works even though http doesn't
Version: 2.0
- Change: Fetch data from another place
Version: 1.4
- Fix: Made ajax request async so it won't hang the whole site when the request doesn't work
Version: 1.3
- Added: Color coding on low, mid, high difference of the player count shown/the actual ones playing.
- Added: Option to remove spectators/commanders if there are none. This is to trim down the view.
Version: 1.1
- Fixed a bug that prevented automatic loading on page load (Worked from the Editor but not when uploaded).
Version: 1.0
- Initial release
*/


var instanssi;

// initialize your plugin
BBLog.handle("add.plugin", {

    /**
    * The unique, lowercase id of my plugin
    * Allowed chars: 0-9, a-z, -
    */
    id: "xfilefin-true-playercounts",

    /**
    * The name of my plugin, used to show config values in bblog options
    * Could also be translated with the translation key "plugin.name" (optional)
    *
    * @type String
    */
    name: "True Player Counts",

    /**
    * Some translations for this plugins
    * For every config flag must exist a corresponding EN translation
    *   otherwise the plugin will no be loaded
    *
    * @type Object
    */
    translations: {
        "en": {
            "use.true-playercounts": "Use True Player Counts",
            "use.trim-view": "Trim Spectator/Commander",
            "change-color-high": "Change color (High)",
            "choose-color-high": "Choose a color of your choice. Example: #ff0000",
            "change-color-mid": "Change color (Mid)",
            "choose-color-mid": "Choose a color of your choice. Example: #99b839",
            "change-color-low": "Change color (Low)",
            "choose-color-low": "Choose a color of your choice. Example: #39b54a"
        },
        "de": {
            "use.true-playercounts": "Use True Player Counts",
            "use.trim-view": "Trim Spectator/Commander",
            "change-color-high": "Farbe Ã¤ndern (High)",
            "choose-color-high": "WÃ¤hle eine Farbe deiner Wahl. Beispiel: #ff0000",
            "change-color-mid": "Farbe Ã¤ndern (Mid)",
            "choose-color-mid": "WÃ¤hle eine Farbe deiner Wahl. Beispiel: #99b839",
            "change-color-low": "Farbe Ã¤ndern (Low)",
            "choose-color-low": "WÃ¤hle eine Farbe deiner Wahl. Beispiel: #39b54a"
        }
    },

    stdColorHigh: "#ff0000",
    stdColorMid: "#99b839",
    stdColorLow: "#39b54a",

    /**
    * Configuration Options that appears in the BBLog Menu
    * Every option must be an object with properties as shown bellow
    * Properties available:
    *   key : The name for your config flag - The user can toggle this option
    *         and you can retreive the users choice with instance instance.storage(YOUR_KEY_NAME) (0 or 1 will be returned)
    *   init : Can be 0 or 1 - Represent the initial status of the option when the user load the plugin for the first time
    *          If you want that this option is enabled on first load (opt-out) than set it to 1, otherwise to 0 (opt-in)
    *   handler(optional): When set as a function this config entry turns into a button (like the plugins button you see in the bblog menu)
    *                       The function well be executed when the user clicks the button
    */
    configFlags: [
        { "key": "use.true-playercounts", "init": 1 },
        { "key": "use.trim-view", "init": 0 },
        {
            "key": "change-color-high", "init": 0, "handler": function (instance) {
                var color = prompt(instance.t("choose-color-high"));
                if (color.charAt(0) != "#") {
                    color = + "#";
                }

                var isHexValue = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
                if (isHexValue) {
                    instance.storage("colorHigh", color);
                }
            }
        },
        {
            "key": "change-color-mid", "init": 0, "handler": function (instance) {
                var color = prompt(instance.t("choose-color-mid"));
                if (color.charAt(0) != "#") {
                    color = + "#";
                }

                var isHexValue = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
                if (isHexValue) {
                    instance.storage("colorMid", color);
                }
            }
        },
        {
            "key": "change-color-low", "init": 0, "handler": function (instance) {
                var color = prompt(instance.t("choose-color-low"));
                if (color.charAt(0) != "#") {
                    color = + "#";
                }

                var isHexValue = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
                if (isHexValue) {
                    instance.storage("colorLow", color);
                }
            }
        }
    ],

    /**
    * A handler that be fired immediately (only once) after the plugin is loaded into bblog
    *
    * @param object instance The instance of your plugin which is the whole plugin object
    *    Always use "instance" to access any plugin related function, not use "this" because it's not working properly
    *    For example: If you add a new function to your addon, always pass the "instance" object
    */
    init: function (instance) {
        // some log to the console to show you how the things work
        /*console.log(
            "plugin."+instance.id+".init"
        );*/
        instanssi = instance;
    },

    /**
    * A trigger that fires everytime when the dom is changing but at max only once each 200ms (5x per second) to prevent too much calls in a short time
    * Example Case: If 10 DOM changes happen in a period of 100ms than this function will only been called 200ms after the last of this 10 DOM changes
    * This make sure that all actions in battlelog been finished before this function been called
    * This is how BBLog track Battlelog for any change, like url, content or anything
    *
    * @param object instance The instance of your plugin which is the whole plugin object
    *    Always use "instance" to access any plugin related function, not use "this" because it's not working properly
    *    For example: If you add a new function to your addon, always pass the "instance" object
    */
    domchange: function (instance) {
        instanssi = instance;

        S.globalContext.staticContext.keeperQueryEndpoint = "https://keeper.battlelog.com"
    },
});

$( document ).ready(function() {
    S.globalContext.staticContext.keeperQueryEndpoint = "https://keeper.battlelog.com"
});

// https://stackoverflow.com/a/14084869
// Create a closure
(function () {
    // Your base, I'm in it!
    var originalAddClassMethod = jQuery.fn.addClass;

    jQuery.fn.addClass = function () {
        if(jQuery.inArray("loading-info", arguments) !== -1){
            if (this.hasClass("bblog-serverbrowser-filters")) {
                this.removeClass("bblog-serverbrowser-filters");
            }
        }
        if(jQuery.inArray("bblog-serverbrowser-filters", arguments) !== -1){
            if (!this.hasClass("bblog-serverbrowser-filters")) {
                doTheMagic(this);
            }
        }

        // Execute the original method.
        var result = originalAddClassMethod.apply(this, arguments);

        // trigger a custom event
        jQuery(this).trigger('cssClassChanged');

        // return the original result
        return result;
    }
})();

function doTheMagic(row){
    if (!instanssi.storage("use.true-playercounts")) {
        return;
    }

    if (BBLog.cache("mode") != "bf4" || !serverbrowserwarsaw || !serverbrowserwarsaw.table) {
        return;
    }

    var data = $(row).data("server");
    if (!data) return true;

    // True player count
    var url = "https://keeper.battlelog.com/snapshot/" + data.guid;

    var $serverRow = $(row);
    function showTrueCounts(response) {
        if (response.snapshot.status == "SUCCESS") {
            var totalPlayers = 0;

            var snapshot = response.snapshot;
            var teamInfos = snapshot.teamInfo;
            totalPlayers += (["0"] in teamInfos ? BBLog.count(teamInfos["0"].players) : 0);
            totalPlayers += (["1"] in teamInfos ? BBLog.count(teamInfos["1"].players) : 0);
            totalPlayers += (["2"] in teamInfos ? BBLog.count(teamInfos["2"].players) : 0);
            totalPlayers += (["3"] in teamInfos ? BBLog.count(teamInfos["3"].players) : 0);
            totalPlayers += (["4"] in teamInfos ? BBLog.count(teamInfos["4"].players) : 0);

            if (data.slots[2]) {
                if (!$serverRow.find(".bblog-slots.trueplayercount").length) {
                    if ($serverRow.find(".bblog-slots.commander").length) {
                        $serverRow.find(".bblog-slots.commander").before('<div class="bblog-slots trueplayercount">' + totalPlayers + "/" + data.slots[2].max + '</div>');
                    }
                    else if ($serverRow.find(".bblog-slots.spectator").length) {
                        $serverRow.find(".bblog-slots.spectator").before('<div class="bblog-slots trueplayercount">' + totalPlayers + "/" + data.slots[2].max + '</div>');
                    }
                    else {
                        $serverRow.find("td.players").append('<div class="bblog-slots trueplayercount">' + totalPlayers + "/" + data.slots[2].max + '</div>');
                    }
                }
                else{
                    $serverRow.find(".bblog-slots.trueplayercount").html('<div class="bblog-slots trueplayercount">' + totalPlayers + "/" + data.slots[2].max + '</div>');
                }
                var serverplayers = $serverRow.find(".bblog-slots.trueplayercount");

                var difference = Math.abs(data.slots[2].current - totalPlayers);
                if (difference <= 2) {
                    if (instanssi.storage("change-color-low")) {
                        var color = instanssi.storage("colorLow");
                        if (color !== null) {
                            $(serverplayers).css("color", color);
                        }
                        else {
                            $(serverplayers).css("color", instanssi.stdColorLow);
                        }
                    }
                    else {
                        $(serverplayers).css("color", instanssi.stdColorLow);
                    }
                }
                else if (difference <= 5) {
                    if (instanssi.storage("change-color-mid")) {
                        var color = instanssi.storage("colorMid");
                        if (color !== null) {
                            $(serverplayers).css("color", color);
                        }
                        else {
                            $(serverplayers).css("color", instanssi.stdColorMid);
                        }
                    }
                    else {
                        $(serverplayers).css("color", instanssi.stdColorMid);
                    }
                }
                else {
                    if (instanssi.storage("change-color-high")) {
                        var color = instanssi.storage("colorHigh");
                        if (color !== null) {
                            $(serverplayers).css("color", color);
                        }
                        else {
                            $(serverplayers).css("color", instanssi.stdColorHigh);
                        }
                    }
                    else {
                        $(serverplayers).css("color", instanssi.stdColorHigh);
                    }
                }
                $(serverplayers).css("font-size", "12px");
                
                // Replace current with totalPlayers and re-sort server table.
                // Enables sorting by true player count.
                data.slots[2].current = totalPlayers;
                serverbrowserwarsaw.sorter.refresh();
            }

            // Remove the unneeded nodes to make the view a bit nicer/cleaner
            if (instanssi.storage("use.trim-view")) {
                if (data.slots[4] && $serverRow.find(".bblog-slots.commander").length && data.slots[4].current <= 0) {
                    $serverRow.find(".bblog-slots.commander").css("display", "none");
                }
                if (data.slots[8] && $serverRow.find(".bblog-slots.spectator").length && data.slots[8].current <= 0) {
                    $serverRow.find(".bblog-slots.spectator").css("display", "none");
                }
            }
        }
    }

    // Fetch the current data
    $.ajax({
        async: true,
        url: url,
        error: function () {
            //console.log("Fetching: " + url + " timed out.");
        },
        success: function (result) {
            //console.log(result);
            if (result) {
                showTrueCounts(result);
            }
        },
        timeout: 5000 // sets timeout to 5 seconds
    });
}
