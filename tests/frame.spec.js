describe('Frame', function(){
    describe('When I create a new Frame', function(){
        it('Then the x, y attributes should be set correctly', function(){
            var frame = new uiWidgets.Frame(game, 12, 37);

            chai.expect(frame.x).to.equal(12);
            chai.expect(frame.y).to.equal(37);

        });
    });
    describe('When I create a new Frame with no x, y attributes', function(){
        it('Then the x, y attributes should be 0', function(){
            var frame = new uiWidgets.Frame(game);

            chai.expect(frame.x).to.equal(0);
            chai.expect(frame.y).to.equal(0);

        });
    });
    describe('When I add a new node to a Frame', function(){
        it('Then it should be added as a child of the Frame', function(){
            var frame = new uiWidgets.Frame(game);
            var dummySprite = game.add.sprite(0, 0);
            frame.addNode(dummySprite);

            chai.expect(frame.children[0]).to.equal(dummySprite);
        });
    });
});
