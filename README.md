# RefJSON
RefJSON is a TypeScript library for serializing and deserializing JavaScript objects, with support for nested and circular references. It extends the capabilities of `JSON.stringify` and `JSON.parse` by preserving object references, allowing for accurate reconstruction of complex object graphs.

## Features
+ Preserves Object References: Handles nested and circular references within objects, ensuring that the serialized data accurately represents the original object structure.
+ External References: Supports serialization and deserialization of objects that reference external resources not included in the serialization.
+ Primitive Types Support: Seamlessly serializes and deserializes primitive types, behaving like native JSON methods.

## Installation
Install the library via npm:
```sh
npm install refjson
```

## Usage
### Importing
```typescript
import { serialize, deserialize } from 'refjson';
// or
import * as refjson from 'refjson';
```

## Serializing and Deserializing Objects
### Handling Circular References
RefJSON automatically handles objects with circular references.
```typescript
const alice = { name: 'Alice' };
const bob = { name: 'Bob', friend: alice };
alice.friend = bob; // Circular reference

const jsonString = refjson.serialize(alice);

const reconstructedAlice = refjson.deserialize(jsonString);

console.log(reconstructedAlice.friend.friend === reconstructedAlice); // true
```

### External References
Serialize objects that reference external resources by providing a mapping of external objects to identifiers.

```typescript
const externalResource = { name: 'External Resource' };
const data = { value: 42, resource: externalResource };

// Map external objects to identifiers
const externRefToName = new Map<any, string>();
externRefToName.set(externalResource, 'externalResourceId');

// Serialize with external references
const jsonString = refjson.serialize(data, false, externRefToName);
```

During deserialization, provide a mapping from identifiers back to the external objects.

```typescript
// Map identifiers back to external objects
const externNameToRef = new Map<string, any>();
externNameToRef.set('externalResourceId', externalResource);

const reconstructedData = refjson.deserialize(jsonString, externNameToRef);

console.log(reconstructedData.resource === externalResource); // true
```

### Serializing Primitive Types
RefJSON supports serialization of primitive types, similar to JSON.stringify.

```typescript
console.log(refjson.serialize(123)); // "123"
console.log(refjson.deserialize(refjson.serialize(123))); // 123

console.log(refjson.serialize('Hello, World!')); // "\"Hello, World!\""
console.log(refjson.deserialize(refjson.serialize('Hello, World!'))); // "Hello, World!"
```

## API Reference
### `serialize(val: unknown, formatted?: boolean, externRefToName?: Map<any, string> | WeakMap<any, string>): string`
Serializes a JavaScript value, preserving object references.

+ `val`: The value to serialize.
+ `formatted` (optional): If `true`, the output JSON string will be formatted with indentation for readability. Defaults to `false`.
+ `externRefToName` (optional): A map of external objects to their identifiers. External objects are not included in the serialized data but are referenced by their identifiers.

### `deserialize(str: string, externNameToRef?: Map<string, any>): unknown`
Deserializes a JSON string produced by `serialize`, reconstructing the original object graph.

## Error Handling
+ **Missing External Reference Map**: If external references are present in the serialized data but `externNameToRef` is not provided during deserialization, an error is thrown.
```typescript
const jsonString = refjson.serialize(data, false, externRefToName);

// Throws error because externNameToRef is missing
refjson.deserialize(jsonString);
```

+ **Unresolved External References**: If an external reference identifier is not found in externNameToRef, an error is thrown.
```typescript
const externNameToRef = new Map<string, any>();
// Missing 'externalResourceId' mapping

// Throws error because 'externalResourceId' is not in externNameToRef
refjson.deserialize(jsonString, externNameToRef);
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request on GitHub.