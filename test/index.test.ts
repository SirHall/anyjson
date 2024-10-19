import * as refjson from "../src/index";

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

    let json = refjson.serialize({ bob, sarah, dirk, sam });

    let obj = refjson.deserialize(json);

    let json2 = refjson.serialize(obj);

    // console.log(json);
    // console.log(util.inspect(obj, { showHidden: true, depth: null, colors: true }));
    // console.log(json2);

    expect(json2).toBe(json);
});

test("Serialize external refs", () =>
{
    let external = { name: "Big external object, that references local hardware" };
    let toSerialize = { dataA: 1, dataB: 2, dataC: "5", hardwareAbstractionLayer: external };

    let refToStr = new Map<any, string>()
    let strToRef = new Map<string, any>();

    refToStr.set(external, "hal");
    strToRef.set("hal", external);

    let json = refjson.serialize(toSerialize, true, refToStr);

    let obj = refjson.deserialize(json, strToRef);

    let json2 = refjson.serialize(obj, true, refToStr);

    // console.log(json);
    // console.log(json2);

    expect(json2).toBe(json);
});

test("Serialize non-objects", () =>
{
    expect(refjson.serialize(4)).toBe("4");
    expect(refjson.deserialize(refjson.serialize(4))).toBe(4);

    expect(refjson.serialize("refjson")).toBe('"refjson"');
    expect(refjson.deserialize(refjson.serialize("refjson"))).toBe("refjson");
});

test("Invalid external value is deserialized", () =>
{
    let external = { name: "Big external object, that references local hardware" };
    let toSerialize = { dataA: 1, dataB: 2, dataC: "5", hardwareAbstractionLayer: external };

    let refToStr = new Map<any, string>()
    refToStr.set(external, "hal");


    let json = refjson.serialize(toSerialize, true, refToStr);

    expect(() => refjson.deserialize(json)).toThrowError(new Error(`Found the external object key 'hal' but no external name-to-ref map was provided`))

    let emptyMap = new Map<string, any>();

    expect(() => refjson.deserialize(json, emptyMap)).toThrowError(new Error(`Found the external object key 'hal' but could not find it in the name-to-ref map`))

});