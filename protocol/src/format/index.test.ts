import { buildData, InferSchema, parseData, SchemaBuilder } from "./fun-protocol-format";

const getInfoSchema = SchemaBuilder.schemaDefinition({
    apiKey: SchemaBuilder.number16(),
    src: SchemaBuilder.string(),
    arr: SchemaBuilder.array(
        SchemaBuilder.schemaDefinition({
            num: SchemaBuilder.number8(),
        }),
    ),
});

type GetInfoParams = InferSchema<typeof getInfoSchema>;

const data: GetInfoParams = {
    apiKey: 2,
    src: "bobur zo'r bola",
    arr: [{ num: 12 }, { num: 63 }],
};

const buffer = buildData(data, getInfoSchema);

console.log(buffer);

const dataParsed = parseData(buffer, getInfoSchema);

console.log(dataParsed);
