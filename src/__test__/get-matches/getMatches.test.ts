/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as lambda from "../../get-matches/getMatches";
import { eventMock } from "../mock";
// import { kayn } from '../../helper/intializeKayn';

describe("get-matches", () => {
  it("without any queries", async () => {
    eventMock.queryStringParameters = {};
    const result = await lambda.getMatches(eventMock);
    console.log(result);
    expect(result.statusCode).toBe(400);
  });
  it("with empty parameter", async () => {
    eventMock.queryStringParameters = {
      gameId: "",
      summonerId: "",
      region: ""
    };
    const result = await lambda.getMatches(eventMock);
    console.log(result);
    expect(result.statusCode).toBe(400);
  });
  it("with invalid offset and limit parameter", async () => {
    eventMock.queryStringParameters = {
      offset: "Invalid offset",
      limit: "Invalid limit",
      summonerId: "blahblahblahblah",
      region: "kr"
    };
    const result = await lambda.getMatches(eventMock);
    console.log(result);
    expect(result.statusCode).toBe(400);
  });
});
