export const stringify = serialize;
export const parse = deserialize;

// TODO: I could make both of these not require a stack and just perform a single pass if I can absolutely guarantee
// that serialize will output an ordered array

export function serialize(val: any, formatted: boolean = false): string {

    // We do want to support any type of data
    if (typeof val !== "object") return JSON.stringify(val);

    let refMap = new Map<Object, number>();
    let completedRefSet = new Set<Object>();

    completedRefSet.add(val);

    let refStack: any[] = [val];
    let nextId: number = 0;

    const getObjId = (v: any) => {
        let id = refMap.get(v);
        if (id == null) {
            id = nextId++;
            refMap.set(v, id);
        }
        return id;
    }

    // This is what we will serialize, just a list of objects with inter-references
    let storeObjList = { ["$refRoot"]: true, root: {} as any };

    while (refStack.length > 0) {

        const obj = refStack.pop();
        const id = getObjId(obj);
        const isArray = Array.isArray(obj);

        const serObj: any = {
            ["$className"]: isArray ? "!Array!" : val.constructor.name,
            ["$ref"]: id,
            data: isArray ? [] : {}
        };

        for (const [key, value] of Object.entries(obj)) {
            if (typeof value !== "object" || value == null) {
                serObj.data[key] = value; // This is a primitive type (or function)
                continue;
            }

            // The only object-type values that can make it into the objects we are serializing are control objects like this
            let newRef = { ["$refTo"]: getObjId(value) };
            if (isArray)
                serObj.data.push(newRef);
            else
                serObj.data[key] = newRef;

            if (!completedRefSet.has(value)) {
                refStack.push(value);
                completedRefSet.add(value);
            }
        }

        storeObjList.root[id] = serObj;
    }

    return JSON.stringify(storeObjList, null, formatted ? 4 : undefined);
}

export function deserialize(str: string): any {
    const dataIn = JSON.parse(str);
    if (typeof dataIn !== "object") return dataIn;
    if (dataIn.$refRoot !== true) return dataIn;

    // We always start with object 0
    let stack = [0];
    let completed = new Set<number>();

    // We will mutate the deserialized parsed JSON to attempt to conserve some memory
    while (stack.length > 0) {
        const objId = stack.pop();
        if (objId == null) continue;
        const obj = dataIn.root[objId];
        if (obj == null) continue;

        // Iterate through its fields and replace all references
        for (const [key, value] of Object.entries(obj.data) as [string, any][]) {
            if (value == null || typeof value !== "object") continue;

            if (value.$refTo != null && typeof value.$refTo === "number") {
                obj.data[key] = dataIn.root[value.$refTo].data;
                if (!completed.has(value.$refTo)) {
                    stack.push(value.$refTo);
                    completed.add(value.$refTo);
                }
            }
        }
    }

    return dataIn.root[0].data;
}