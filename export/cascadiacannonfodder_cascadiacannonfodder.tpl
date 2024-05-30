{OVERALL_GAME_HEADER}

<!-- 
--------
-- BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
-- CascadiaCannonFodder implementation : © <Your name here> <Your email address here>
-- 
-- This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
-- See http://en.boardgamearena.com/#!doc/Studio for more information.
-------

    cascadiacannonfodder_cascadiacannonfodder.tpl
    
    This is the HTML template of your game.
    
    Everything you are writing in this file will be displayed in the HTML page of your game user interface,
    in the "main game zone" of the screen.
    
    You can use in this template:
    _ variables, with the format {MY_VARIABLE_ELEMENT}.
    _ HTML block, with the BEGIN/END format
    
    See your "view" PHP file to check how to set variables and control blocks
    
    Please REMOVE this comment before publishing your game on BGA
-->

<div id="Game">
<div id = "Market" style="display: inline-block">
    <table>
    <!-- BEGIN market_row -->
        <tr>
            <!-- BEGIN market_element -->
                <td style = "width: 100px">
                <div id = "{ROW}_{PLACE}" style="display: inline-block" class=".single_card">
                .
                </div>
                </td>
            <!-- END market_element -->
        </tr>
    <!-- END market_row -->
    </table>
</div>
<div id = "ScoringCards" style="display: inline-block;width: 200px;">
    <table>
        <tr>
        .
            <!-- BEGIN scoring_card -->
                <td>
                <div id = "scoring_card_{PLACE}" style="display: inline-block" class=".single_card">
                </div>
                </td>
            <!-- END scoring_card -->
        </tr>
    </table>
</div>

<div style="display: inline-block; position: relative; background-color: #EBEBEB; width: 600px; height: 400px" id="obtained_item">
This is your game interface. You can edit this HTML in your ".tpl" file.
</div>

</div>


<script type="text/javascript">

// Javascript HTML templates

/*
// Example:
var jstpl_some_game_item='<div class="my_game_item" id="my_game_item_${MY_ITEM_ID}"></div>';

*/

</script>  

{OVERALL_GAME_FOOTER}
