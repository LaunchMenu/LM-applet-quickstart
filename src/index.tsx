import React, {FC} from "react";
import {useDataHook} from "model-react";
import {
    Box,
    createSettings,
    createSettingsFolder,
    createStandardMenuItem,
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

const Content: FC = () => {
    const context = useIOContext();
    const [hook] = useDataHook();
    const name = context?.settings.get(settings).name.get(hook);
    return <Box color="primary">Hello {name}!</Box>;
};

const items = [
    createStandardMenuItem({
        name: "Hello world",
        onExecute: () => alert("Hello!"),
        content: <Content />,
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
