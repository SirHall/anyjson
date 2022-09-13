import * as anyjson from "../src/index";

test("Serialize friends", () =>
{

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

    // console.log(json);
    // console.log(util.inspect(obj, { showHidden: true, depth: null, colors: true }));
    // console.log(json2);

    expect(json2).toBe(json);
});

test("Serialize external refs", async () =>
{
    let external = { name: "Big external object, that references local hardware" };
    let toSerialize = { dataA: 1, dataB: 2, dataC: "5", hardwareAbstractionLayer: external };

    let refToStr = new Map<any, string>()
    let strToRef = new Map<string, any>();

    refToStr.set(external, "hal");
    strToRef.set("hal", external);

    let json = anyjson.serialize(toSerialize, true, refToStr);

    let obj = anyjson.deserialize(json, strToRef);

    let json2 = anyjson.serialize(obj, true, refToStr);

    // console.log(json);
    // console.log(json2);

    expect(json2).toBe(json);
});