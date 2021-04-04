import React, {FC} from "react";
import {useDataHook} from "model-react";
import {
    Box,
    createContextAction,
    createSettings,
    createSettingsFolder,
    createStandardMenuItem,
    createStandardSearchPatternMatcher,
    createStringSetting,
    declare,
    Menu,
    searchAction,
    UILayer,
    useIOContext,
} from "@launchmenu/core";

export const info = {
    name: "HelloWorld",
    description: "A minimal example applet",
    version: "0.0.0",
    icon: "applets",
} as const;

export const settings = createSettings({
    version: "0.0.0",
    settings: () =>
        createSettingsFolder({
            ...info,
            children: {
                name: createStringSetting({name: "User name", init: "Bob"}),
            },
        }),
});

const helloWorldPattern = createStandardSearchPatternMatcher({
    name: "Hello world",
    matcher: /^world: /,
});

const alertCombined = createContextAction({
    name: "Alert",
    core: (texts: string[]) => ({
        execute: ({context}) => {
            const name = context?.settings.get(settings).name.get();
            const prefix = texts.reduce((total, text, i) => {
                const dist = texts.length - i - 1;
                const spacer = dist == 0 ? "" : dist == 1 ? " and " : ", ";
                return total + (i > 0 ? text.toLowerCase() : text) + spacer;
            }, "");
            alert(`${prefix} ${name}`);
        },
    }),
});

const Content: FC<{text: string}> = ({text}) => {
    const context = useIOContext();
    const [hook] = useDataHook();
    const name = context?.settings.get(settings).name.get(hook);
    return (
        <Box color="primary">
            {text} {name}!
        </Box>
    );
};

const items = [
    createStandardMenuItem({
        name: "Hello world",
        onExecute: () => alert("Hello!"),
        content: <Content text="Hello" />,
        searchPattern: helloWorldPattern,
        actionBindings: [alertCombined.createBinding("Hello")],
    }),
    createStandardMenuItem({
        name: "Bye world",
        onExecute: () => alert("Bye!"),
        content: <Content text="Bye" />,
        searchPattern: helloWorldPattern,
        actionBindings: [alertCombined.createBinding("Bye")],
    }),
];

export default declare({
    info,
    settings,
    async search(query, hook) {
        return {
            children: searchAction.get(items),
        };
    },
    open({context, onClose}) {
        context.open(new UILayer(() => ({menu: new Menu(context, items), onClose})));
    },
});
