module.exports = {
    "parser": "babel-eslint",
    extends: [
        'airbnb-base',
        'plugin:jest/recommended',
    ],
    plugins: [
        'import',
        'jest',
    ],
    env: {
        node: true,
        'jest/globals': true,
    },
};