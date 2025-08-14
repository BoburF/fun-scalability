import { SchemaTypes } from "./schema-enums";

export type SchemaTypeMap = {
    [SchemaTypes.number8]: number;
    [SchemaTypes.number16]: number;
    [SchemaTypes.number32]: number;
    [SchemaTypes.number64]: bigint;
    [SchemaTypes.string]: string;
    [SchemaTypes.boolean]: boolean;
    [SchemaTypes.array]: any[];
};

export type SchemaValidator<T = any> = T extends any[]
    ? {
          name: string;
          type: SchemaTypes.array;
          items: [SchemaValidator<T[number]>];
      }
    : {
          name: string;
          type: SchemaTypes;
          items?: never;
      };

export type SchemaValidators<T extends any[] = any[]> = SchemaValidator<
    T[number]
>[];

export function SchemaValidate(
    data: Buffer,
    schemaValidator: SchemaValidators,
) {
    let offset = 0;

    function readField(validator: SchemaValidator): any {
        switch (validator.type) {
            case SchemaTypes.number8: {
                const value = data.readInt8(offset);
                offset += 1;
                return value;
            }
            case SchemaTypes.number16: {
                const value = data.readInt16BE(offset);
                offset += 2;
                return value;
            }
            case SchemaTypes.number32: {
                const value = data.readInt32BE(offset);
                offset += 4;
                return value;
            }
            case SchemaTypes.number64: {
                const value = data.readBigInt64BE(offset);
                offset += 8;
                return value;
            }
            case SchemaTypes.string: {
                const length = data.readBigUInt64BE(offset);
                offset += 8;
                const value = data.toString(
                    "utf8",
                    offset,
                    offset + Number(length),
                );
                offset += Number(length);
                return value;
            }
            case SchemaTypes.boolean: {
                const byte = data.readUInt8(offset);
                if (byte !== 0 && byte !== 1) {
                    throw new Error(`Invalid boolean byte: ${byte}`);
                }
                offset += 1;
                return byte === 1;
            }
            case SchemaTypes.array: {
                const length = data.readBigUInt64BE(offset);
                offset += 8;
                const result: any[] = [];
                for (let i = 0; i < length; i++) {
                    result.push(readField(validator.items![0]));
                }
                return result;
            }
            default:
                //@ts-ignore
                throw new Error(`Unknown schema type: ${validator.type}`);
        }
    }

    const result: any = {};
    for (const validator of schemaValidator) {
        result[validator.name] = readField(validator);
    }

    if (offset !== data.length) {
        throw new Error(
            `Buffer length mismatch: read ${offset} of ${data.length} bytes`,
        );
    }

    return result;
}
