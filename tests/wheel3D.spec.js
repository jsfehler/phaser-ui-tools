describe("Wheel3D", function(){
    describe("When I create a new Wheel3D", function(){
        describe("And I move the wheel backwards", function(){
            it("Then the active sprite should be the previous one", function(done){
                var menuList = [];
                for (var i = 0; i < 4; i++) {
                    var dummySprite = game.add.sprite(0, 0, "dummySprite");
                    menuList.push(dummySprite);
                }

                var wheel = new uiWidgets.Wheel3D(
                    game,
                    {"x": 0, "y": 0},
                    menuList,
                    0,
                    90,
                    "x",
                    {"x":0, "y": -90, "z": 0}
                );

                var isDone = false;

                wheel.emitter.on('complete',
                    function (wheel) {
                        isDone = true;
                });
                wheel.activate();
                wheel.moveBack();

                setTimeout( function () {
                    try {
                        chai.expect(isDone).to.equal(true);
                        done();
                    } catch(err) {
                        done(err);
                    }
                }, 500 );
            });
        });
        describe("And I move the wheel forward", function(){
            it("Then the active sprite should be the next one", function(done){
                var menuList = [];
                for (var i = 0; i < 4; i++) {
                    var dummySprite = game.add.sprite(0, 0, "dummySprite");
                    menuList.push(dummySprite);
                }

                var wheel = new uiWidgets.Wheel3D(
                    game,
                    {"x": 0, "y": 0},
                    menuList,
                    0,
                    90,
                    "x",
                    {"x":0, "y": -90, "z": 0}
                );

                var isDone = false;

                wheel.emitter.on('complete',
                    function (wheel) {
                        isDone = true;
                });
                wheel.activate();
                wheel.moveForward();

                setTimeout( function () {
                    try {
                        chai.expect(isDone).to.equal(true);
                        done();
                    } catch(err) {
                        done(err);
                    }
                }, 500 );

            });
        });
    });
});
