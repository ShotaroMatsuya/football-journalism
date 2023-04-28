
module.exports = {
    extends: ['../.eslintrc.js', 'plugin:cypress/recommended'],
    plugins: ['@typescript-eslint', 'cypress'],
    
    parserOptions: {
      parser: '@typescript-eslint/parser'
    },
    rules: {
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "error",
    }
}