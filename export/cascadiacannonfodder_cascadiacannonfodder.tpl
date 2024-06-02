{OVERALL_GAME_HEADER}

<!-- 
--------
-- BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
-- Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
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
<!--
Draw 4 Wildlife Tokens from the Cloth Bag and pair them, in order, with each of the 4 Habitat Tiles to
form 4 combinations of 1 tile and 1 token.
-->
    <table>
    <!-- BEGIN market_row -->
        <tr>
            <!-- BEGIN market_element -->
                <td style = "width: 100px">
                <div id = "{ROW}_{PLACE}" style="display: inline-block; width: 60px; height: 60px" >
                .
                </div>
                </td>
            <!-- END market_element -->
        </tr>
    <!-- END market_row -->
    </table>
</div>

<div style="display: inline-block; position: relative; background-color: #EBEBEB; width: 600px; height: 400px" id="12345">
<!--
Randomly distribute one Starter Habitat Tile to each player, placing it face-up in front of them. Place the
others back into the box, they will not be used this game.
-->
</div>

<!-- BEGIN player_board -->
<div style="display: inline-block; position: relative;">
{PLAYER_NAME}
<div style="display: inline-block; position: relative; background-color: #EBEBEB; width: 200px; height: 100px" id="{PLAYER_ID}">
<!--
Randomly distribute one Starter Habitat Tile to each player, placing it face-up in front of them. Place the
others back into the box, they will not be used this game.
-->
</div>
</div>
<!-- END player_board -->

<div id = "ScoringCards" style="display: inline-block;width: 200px;">
<!-- 
Randomly select 1 Wildlife Scoring Card for each of the five wildlife, then place those five cards in the
center of the play area within easy view of all players. Put the other Wildlife Scoring Cards back in the
box. (For your first game we recommend using the Wildlife Scoring Cards shown - these are the cards
with ‘A’ in the bottom right corner).
-->
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

<div id="tokens">
</div>

</div>


<script type="text/javascript">
var jstpl_token0='<div class="field" id="${id}"></div>';
var upper_half='<div class="upper_half" id="${id}"></div>';

// Javascript HTML templates

/*
// Example:
var jstpl_some_game_item='<div class="my_game_item" id="my_game_item_${MY_ITEM_ID}"></div>';

*/

</script>  

{OVERALL_GAME_FOOTER}
