describe("Viewport", function(){
    var viewport;

    describe("When I create a new Viewport", function(){
        it("Then the x, y attributes should be set correctly", function(){
            viewport = new uiWidgets.Viewport(game, 17, 102, 103, 104);
            chai.expect(viewport.x).to.equal(17);
            chai.expect(viewport.y).to.equal(102);
        });

        it("Then the area attribute should be set correctly", function(){
            viewport = new uiWidgets.Viewport(game, 17, 102, 103, 104);
            chai.expect(viewport.area.x).to.equal(17);
            chai.expect(viewport.area.y).to.equal(102);
            chai.expect(viewport.area.width).to.equal(103);
            chai.expect(viewport.area.height).to.equal(104);
        });

        it("Then the viewport mask attributes should be set correctly", function(){
            viewport = new uiWidgets.Viewport(game, 17, 102, 103, 104);
            chai.expect(viewport.mask.x).to.equal(17);
            chai.expect(viewport.mask.y).to.equal(102);
            chai.expect(viewport.mask.width).to.equal(103);
            chai.expect(viewport.mask.height).to.equal(104);
        });
    });

    afterEach(function() {
        viewport.destroy();
    });

});
