describe('Row', function(){
    var row;

    describe('When I add a second node to a Row', function(){
        it('Then should be placed next to the first node', function(){
            var dummySprite = game.add.sprite(0, 0, 'dummySprite');
            var dummySprite2 = game.add.sprite(0, 0, 'dummySprite');
            row = new uiWidgets.Row(game);
            row.addNode(dummySprite);
            row.addNode(dummySprite2);

            chai.expect(row.children[1].x).to.equal(300);
        });
    });

    afterEach(function() {
        row.destroy();
    });
});
