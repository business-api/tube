import { tube } from '@core/interactions';

import { fnMonoMock, type MonoMockOptions, type MonoMocks } from './mock';

describe('tube function', () => {
  test('applies three synchronous unary functions', async () => {
    const option: MonoMockOptions = { monoMockOpt: { height: 11, width: 11 } };
    const mock: MonoMocks = {
      monoMock: {
        option: { monoMockOpt: { height: 10, width: 10 } },
        value: 8 as never,
      },
    };
    const result = tube(
      fnMonoMock(option),
      fnMonoMock(mock.monoMock.option),
      fnMonoMock(mock.monoMock.option),
    )(mock);
    expect(result.monoMock.value.height).toBe(20);
    expect(result.monoMock.value.width).toBe(20);
  });
});
