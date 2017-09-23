describe('Column', function(){
    var column;

    describe('When I add a second node to a Column', function(){
        it('Then should be placed under the first node', function(){
            var dummySprite = game.add.sprite(0, 0, 'dummySprite');
            var dummySprite2 = game.add.sprite(0, 0, 'dummySprite');
            column = new uiWidgets.Column(game);
            column.addNode(dummySprite);
            column.addNode(dummySprite2);

            chai.expect(column.children[1].y).to.equal(78);
        });
    });

    afterEach(function() {
        column.destroy();
    });
});
