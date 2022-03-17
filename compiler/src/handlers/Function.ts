import { THandler, es } from "../types";
import { nodeName } from "../utils";
import { StoreValue } from "../values";
import { FunctionValue } from "../values/FunctionValue";

export const ArrowFunctionExpression: THandler = (
  c,
  scope,
  node: es.ArrowFunctionExpression
) => {
  const name = nodeName(node);
  scope = scope.createFunction(name);
  let { params, body } = node;

  if (node.expression) {
    body = {
      type: "BlockStatement",
      body: [
        { ...body, type: "ReturnStatement", argument: body as es.Expression },
      ],
    } as es.BlockStatement;
  }

  const paramNames = [];
  const paramStores: StoreValue[] = [];

  for (const id of params as es.Identifier[]) {
    paramNames.push(id.name);
    paramStores.push(scope.make(id.name, nodeName(id)));
  }

  return [
    new FunctionValue(
      scope,
      name,
      paramNames,
      paramStores,
      body as es.BlockStatement,
      c
    ),
    [],
  ];
};

export const FunctionDeclaration: THandler = (
  c,
  scope,
  node: es.FunctionDeclaration
) => {
  return [
    scope.set(
      (node.id as es.Identifier).name,
      ArrowFunctionExpression(c, scope, node, null)[0]
    ),
    [],
  ];
};

export const FunctionExpression: THandler = ArrowFunctionExpression;
export const ObjectMethod: THandler = ArrowFunctionExpression;
