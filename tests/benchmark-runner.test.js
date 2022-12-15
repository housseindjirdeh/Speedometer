import { jest } from "@jest/globals";
import { BenchmarkRunner } from "../resources/benchmark-runner";

jest.useFakeTimers();

describe("BenchmarkRunner", () => {
    let runner = null;
    const suites = ["Suite 1", "Suite 2"];
    const client = {
        willRunTest: () => null,
        didRunTest: () => null,
        didRunSuites: () => null,
    };

    beforeAll(() => {
        runner = new BenchmarkRunner(suites, client);
    });

    test("runner is defined", () => {
        expect(runner).not.toBeNull();
    });

    describe("_writeMark", () => {
        it("should fire performance.mark with the correct name", () => {
            window.performance.mark = jest.fn(); // stubbing performance.mark as it's not available by default in jsdom: https://jestjs.io/docs/next/timer-mocks#selective-faking

            const performanceMarkSpy = jest.spyOn(global.performance, "mark");
            runner._writeMark("Button clicked");
            expect(performanceMarkSpy).toHaveBeenCalledWith("Button clicked");
        });
    });

    describe("Frame", () => {
        describe("_removeFrame", () => {
            let frame, removeChildSpy;

            beforeAll(() => {
                jest.clearAllMocks();
                frame = runner._appendFrame();

                removeChildSpy = jest.spyOn(frame.parentNode, "removeChild");
            });

            it("should remove the frame if a frame is defined", () => {
                expect(runner._frame).toEqual(frame);

                runner._removeFrame();

                expect(removeChildSpy).toHaveBeenCalledWith(frame);
                expect(runner._frame).toEqual(null);
            });
        });

        describe("_appendFrame", () => {
            it("should create an absolutely positioned iframe with 800px x 600px dimensions", () => {
                const createElementSpy = jest.spyOn(document, "createElement");

                const frame = runner._appendFrame();
                expect(frame).toBeInstanceOf(HTMLIFrameElement);
                expect(createElementSpy).toHaveBeenCalledWith(
                    frame.nodeName.toLowerCase()
                );
                expect(frame.style.width).toBe("800px");
                expect(frame.style.height).toBe("600px");
                expect(frame.style.position).toBe("absolute");
            });

            it("should disable scrolling in the frame", () => {
                const { scrolling } = runner._appendFrame();
                expect(scrolling).toBe("no");
            });

            it("should add 8px left and top spacing to the frame if the window is larger than 800px x 600px", () => {
                const { style } = runner._appendFrame();
                expect(style.left).toBe("8px");
                expect(style.top).toBe("8px");
            });

            it("should not add outer spacing to the frame if the window is smaller than 800px x 600px", () => {
                window.innerWidth = 700;

                const { style } = runner._appendFrame();
                expect(style.left).toBe("0px");
                expect(style.top).toBe("0px");
            });

            it("should insert the frame as the first child in the document body", () => {
                const firstChild = document.createTextNode("First Child");
                document.body.prepend(firstChild);

                const insertBeforeSpy = jest.spyOn(
                    document.body,
                    "insertBefore"
                );
                const frame = runner._appendFrame();
                expect(insertBeforeSpy).toHaveBeenCalledWith(frame, firstChild);
            });
        });
    });

    describe("Suite", () => {
        describe("_runAllSuites", () => {
            let _runSuiteSpy, _finalizeSpy;
            beforeAll(() => {
                _runSuiteSpy = jest
                    .spyOn(runner, "_runSuite")
                    .mockImplementation(() => jest.fn());
                _finalizeSpy = jest
                    .spyOn(runner, "_finalize")
                    .mockImplementation(() => jest.fn());
            });

            it("should run all test suites", async () => {
                await runner._runAllSuites();

                expect(_runSuiteSpy).toHaveBeenCalledTimes(2);
            });

            it("should remove the previous frame and then the current frame", async () => {
                const _removeFrameSpy = jest.spyOn(runner, "_removeFrame");
                await runner._runAllSuites();

                expect(_removeFrameSpy).toHaveBeenCalledTimes(2);
            });

            it("should fire the function responsible for finalizing results", async () => {
                await runner._runAllSuites();

                expect(_finalizeSpy).toHaveBeenCalled();
            });
        });

        describe("_runSuite", () => {
            let _prepareSuiteSpy, _runTestAndRecordResultsSpy;

            const suite = {
                name: "SuiteName",
                url: "todomvc/vanilla-examples/vanillajs/index.html",
                tests: ["Test 1", "Test 2", "Test 3"],
            };

            beforeAll(async () => {
                jest.restoreAllMocks();
                _prepareSuiteSpy = jest
                    .spyOn(runner, "_prepareSuite")
                    .mockImplementation(() => jest.fn());
                _runTestAndRecordResultsSpy = jest
                    .spyOn(runner, "_runTestAndRecordResults")
                    .mockImplementation(() => jest.fn());
                await runner._runSuite(suite);
            });

            it("should prepare the suite first", async () => {
                expect(_prepareSuiteSpy).toHaveBeenCalled();
            });

            it("should run and record results for every test in suite", async () => {
                expect(_runTestAndRecordResultsSpy).toHaveBeenCalledTimes(3);
            });
        });
    });

    describe("Test", () => {
        describe("_runTestAndRecordResults", () => {
            let _runTestSpy,
                _runTestAndRecordResults,
                willRunTestSpy,
                didRunTestSpy;

            const suite = {
                name: "SuiteName",
                tests: [
                    {
                        name: "Test 1",
                        run: () => jest.fn(),
                    },
                ],
            };

            beforeAll(async () => {
                jest.restoreAllMocks();
                runner._appendFrame();

                _runTestSpy = jest.spyOn(runner, "_runTest");
                willRunTestSpy = jest.spyOn(runner._client, "willRunTest");
                didRunTestSpy = jest.spyOn(runner._client, "didRunTest");

                _runTestAndRecordResults = runner._runTestAndRecordResults(
                    suite,
                    suite.tests[0]
                );

                jest.runAllTimers();

                // Mocking performance.now calls to measure test sync and async times (ms)
                jest.spyOn(global.performance, "now")
                    .mockReturnValueOnce(8000000) // startTime (sync)
                    .mockReturnValueOnce(10000000) // endTime (sync)
                    .mockReturnValueOnce(12000000) // startTime (async)
                    .mockReturnValueOnce(13000000); // endTime (async)
            });

            it("should run the test with the correct arguments", () => {
                return _runTestAndRecordResults.then(() => {
                    expect(_runTestSpy).toHaveBeenCalledWith(
                        suite,
                        suite.tests[0],
                        runner._page,
                        expect.any(Function)
                    );
                });
            });

            it("should run client pre and post hooks if present", () => {
                return _runTestAndRecordResults.then(() => {
                    expect(willRunTestSpy).toHaveBeenCalledWith(
                        suite,
                        suite.tests[0]
                    );
                    expect(didRunTestSpy).toHaveBeenCalledWith(
                        suite,
                        suite.tests[0]
                    );
                });
            });
        });

        describe("_runTest", () => {
            let _writeMarkSpy, _testFnSpy, page;
            const callback = jest.fn();
            const testFn = jest.fn();

            const suite = {
                name: "SuiteName",
                url: "todomvc/vanilla-examples/vanillajs/index.html",
            };

            const test = {
                name: "Click a button",
                run: testFn,
            };

            beforeAll(() => {
                page = { _frame: runner._appendFrame() };
                _writeMarkSpy = jest.spyOn(runner, "_writeMark");
                _testFnSpy = jest.spyOn(test, "run");

                runner._runTest(suite, test, page, callback);
            });

            it("should write performance marks at the start and end of the test with the correct test name", () => {
                expect(_writeMarkSpy).toHaveBeenCalledWith(
                    "SuiteName.Click a button-start"
                );
                expect(_writeMarkSpy).toHaveBeenCalledWith(
                    "SuiteName.Click a button-sync-end"
                );

                jest.runAllTimers();

                expect(_writeMarkSpy).toHaveBeenLastCalledWith(
                    "SuiteName.Click a button-async-end"
                );
                expect(_writeMarkSpy).toHaveBeenCalledTimes(3);
            });

            it("should run the test", () => {
                expect(_testFnSpy).toHaveBeenCalledWith(page);
            });

            it("should fire the callback with correct arguments for sync time, async time, and frame height", () => {
                const height =
                    runner._frame.contentDocument.body.getBoundingClientRect()
                        .height;

                expect(callback).toHaveBeenCalledWith(2000000, 1000000, height);
            });
        });
    });

    describe("Finalize", () => {
        describe("_finalize", () => {
            let _runTestAndRecordResults, didRunSuitesSpy;

            const syncStart = 8000000;
            const syncEnd = 10000000;
            const asyncStart = 12000000;
            const asyncEnd = 13000000;

            const suite = {
                name: "SuiteName",
                tests: [
                    {
                        name: "Test 42324",
                        run: () => jest.fn(),
                    },
                ],
            };

            beforeAll(async () => {
                jest.restoreAllMocks();
                runner._measuredValues.tests = {};

                // Mocking performance.now calls to measure test sync and async times (ms)
                jest.spyOn(global.performance, "now")
                    .mockReturnValueOnce(syncStart) // startTime (sync)
                    .mockReturnValueOnce(syncEnd) // endTime (sync)
                    .mockReturnValueOnce(asyncStart) // startTime (async)
                    .mockReturnValueOnce(asyncEnd); // endTime (async)
                _runTestAndRecordResults = runner._runTestAndRecordResults(
                    suite,
                    suite.tests[0]
                );
                didRunSuitesSpy = jest.spyOn(runner._client, "didRunSuites");

                jest.runAllTimers();
            });

            it("should calculate measured test values correctly", () => {
                return _runTestAndRecordResults.then(() => {
                    const syncTime = syncEnd - syncStart;
                    const asyncTime = asyncEnd - asyncStart;

                    runner._finalize();

                    const total = syncTime + asyncTime;
                    const mean = total / suite.tests.length;
                    const geomean = Math.pow(total, 1 / suite.tests.length);
                    const score = (60 * 1000) / geomean / 3; // correctionFactor = 3

                    const {
                        total: measuredTotal,
                        mean: measuredMean,
                        geomean: measuredGeomean,
                        score: measuredScore,
                    } = runner._measuredValues;

                    expect(measuredTotal).toEqual(total);
                    expect(measuredMean).toEqual(mean);
                    expect(measuredGeomean).toEqual(geomean);
                    expect(measuredScore).toEqual(score);
                });
            });

            it("should run the client run suites hook with measured values", () => {
                return _runTestAndRecordResults.then(() => {
                    expect(didRunSuitesSpy).toHaveBeenCalledWith(
                        runner._measuredValues
                    );
                });
            });
        });
    });
});
