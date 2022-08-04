import * as anyjson from "../src/index";
const util = require("util");

test("Serialize friends", () => {

    let bob = { name: "Bob", friends: new Array<any>() };
    let sarah = { name: "Sarah", friends: new Array<any>() };
    let dirk = { name: "Dirk", friends: new Array<any>() };
    let sam = { name: "Sam", friends: new Array<any>() };

    bob.friends.push(sarah);
    sarah.friends.push(bob);
    dirk.friends.push(bob);
    sam.friends.push(dirk);
    bob.friends.push(sam);
    bob.friends.push(bob);

    let json = anyjson.serialize({ bob, sarah, dirk, sam });

    let obj = anyjson.deserialize(json);

    let json2 = anyjson.serialize(obj);

    console.log(json);
    console.log(util.inspect(obj, { showHidden: true, depth: null, colors: true }));
    console.log(json2);

    // expect(json).toBe("");
    // expect(obj).toBe("");
});
