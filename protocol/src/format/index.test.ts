import {
    buildData,
    InferSchema,
    parseData,
    SchemBuilder,
} from "./fun-protocol-format";

const getInfoSchema = SchemBuilder.schemaDefinition({
    apiKey: SchemBuilder.number16(),
    src: SchemBuilder.string(),
});

type GetInfoParams = InferSchema<typeof getInfoSchema>;

const data: GetInfoParams = {
    apiKey: 2,
    src: "bobur zo'r bola",
};

const buffer = buildData(data, getInfoSchema);

console.log(buffer);

const dataParsed = parseData(buffer, getInfoSchema);

console.log(dataParsed);
