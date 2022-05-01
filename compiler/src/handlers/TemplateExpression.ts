import { ZeroSpaceInstruction } from "../instructions";
import { es, IInstruction, IValue, THandler } from "../types";

export const TemplateLiteral: THandler<null> = (
  c,
  scope,
  node: es.TemplateLiteral
) => {
  const args: (string | IValue)[] = [];
  const inst: IInstruction[] = [];
  node.expressions.forEach((expression, i) => {
    const [v, vi] = c.handleConsume(scope, expression);
    inst.push(...vi);
    args.push(node.quasis[i].value.raw, v);
  });
  args.push(node.quasis.slice(-1)[0].value.raw);
  inst.push(new ZeroSpaceInstruction(...args));
  return [null, inst];
};
