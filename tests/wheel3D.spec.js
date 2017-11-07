describe('Wheel3D', function(){
    describe('When I create a new Wheel3D', function(){
        describe('And I move the wheel backwards', function(){
            it('Then the active sprite should be the previous one', function(){
                var menuList = [];
                for (var i = 0; i < 4; i++) {
                    var dummySprite = game.add.sprite(0, 0, 'dummySprite');
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

                wheel.onComplete.add(
                    function (wheel) {
                        chai.expect(wheel.active).to.equal(wheel.wheelItems[3]);
                });
                wheel.activate();
                wheel.moveBack();
            });
        });
        describe('And I move the wheel forward', function(){
            it('Then the active sprite should be the next one', function(){
                var menuList = [];
                for (var i = 0; i < 4; i++) {
                    var dummySprite = game.add.sprite(0, 0, 'dummySprite');
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

                wheel.onComplete.add(
                    function (wheel) {
                        chai.expect(wheel.active).to.equal(wheel.wheelItems[1]);
                });
                wheel.activate();
                wheel.moveForward();
            });
        });
    });
});
