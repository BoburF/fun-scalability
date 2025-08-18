import {
    buildData,
    InferSchema,
    parseData,
    SchemBuilder,
} from "./fun-protocol-format";

const getInfoSchema = SchemBuilder.schemaDefinition({
    apiKey: SchemBuilder.number16(),
    src: SchemBuilder.string(),
    arr: SchemBuilder.array(
        SchemBuilder.schemaDefinition({
            num: SchemBuilder.number8(),
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
