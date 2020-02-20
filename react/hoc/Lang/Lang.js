const Lang = (props) => {
    const { children, ...rest } = props;
    const args = Object.values(rest);
    return E.Lang.translate.apply(null, [children, ...args]);
};

export default Lang;
