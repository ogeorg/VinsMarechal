var request = require('superagent');

// https://github.com/Automattic/expect.js
var expect = require('expect.js');

var pgTC = require('../pgTestConnection.js');

before(function() {
    // console.log("before");
});

describe('Data for index abc', function(){
    beforeEach(function() {
        // console.log("beforeEach");
    });
    it('should store Olivier', function(done){
        pgTC.setData('abc', {name: 'Olivier', age: 44},
            function(command) {
                expect(command).to.be("INSERT");
                done();
            }, 
            function(err) {
                console.log("err", err);
                // expect().fail("error getting data")
                done();
            });
    });
    it('should have name Olivier', function(done){
        pgTC.getData('abc', 
            function(data) {
                expect(data.name).to.be("Olivier");
                done();
            }, 
            function(err) {
                expect().fail("error getting data")
                done();
            });
    });
    it('should not have row xyz', function(done){
        pgTC.getData('xyz', 
            function onSuccess(data) {
                expect().to.fail("should not get data");
                done();
            }, 
            function onSuccess(err) {
                expect().not.to.fail("error getting data");
                done();
            });
    });
    it('should store Marianne', function(done){
        pgTC.setData('abc', {name: 'Marianne', age: 41},
            function(command) {
                expect(command).to.be("UPDATE");
                done();
            }, 
            function(err) {
                console.log("err", err);
                // expect().fail("error getting data")
                done();
            });
    });
    it('should have name Marianne', function(done){
        pgTC.getData('abc', 
            function(data) {
                expect(data.name).to.be("Marianne");
                done();
            }, 
            function(err) {
                expect().fail("error getting data")
                done();
            });
    });
    it('should remove Marianne', function(done){
        pgTC.removeData('abc', 
            function onSuccess(result) {
                expect(result.command).to.be("DELETE");
                expect(result.rowCount).to.be(1);
                done();
            }, 
            function onError(err) {
                expect().fail("error getting data")
                done();
            });
    });
    it('cannot remove Marianne, already removed', function(done){
        pgTC.removeData('abc', 
            function onSuccess(result) {
                expect(result.command).to.be("DELETE");
                expect(result.rowCount).to.be(0);
                done();
            }, 
            function onError(err) {
                expect().fail("error getting data")
                done();
            });
    });
});