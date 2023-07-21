// Enable @defer tests, for some reason this env won't set in npm scripts (or
// when calling npm t from the command line)
process.env["INCREMENTAL_DELIVERY_TESTS_ENABLED"] = "true";
