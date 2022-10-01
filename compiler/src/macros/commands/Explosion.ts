import { assertIsObjectMacro, assertObjectFields } from "../../assertions";
import { InstructionBase } from "../../instructions";
import { IScope } from "../../types";
import { MacroFunction } from "../Function";

export class Explosion extends MacroFunction<null> {
  constructor(scope: IScope) {
    super(scope, options => {
      assertIsObjectMacro(options, "The options");

      const params = assertObjectFields(options, [
        "team",
        "x",
        "y",
        "radius",
        "damage",
        "air",
        "ground",
        "pierce",
      ]);

      return [null, [new InstructionBase("explosion", ...params)]];
    });
  }
}