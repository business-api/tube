/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type Return } from '@core/data';
import { mono } from '@core/interactions';

type ValueMock = {
  width: number;
  height: number;
};
export type MonoMockOptions = Record<'monoMockOpt', ValueMock>;

type MonoMock<T extends ValueMock = ValueMock> = {
  value: T;
  option?: MonoMockOptions;
};

export type MonoMocks = Record<'monoMock', MonoMock>;

type FnMonoMock = {
  <Data extends MonoMocks = MonoMocks>(option?: MonoMockOptions): Return<Data>;
  <Data extends Required<MonoMocks> = Required<MonoMocks>>(
    data: Data,
    option?: MonoMockOptions,
  ): Return<Data, void>;
  <Data extends MonoMocks = MonoMocks>(
    data: Data,
    option?: MonoMockOptions,
  ): Return<Data, Data>;
};

export const fnMonoMock: FnMonoMock = (data?, option?) =>
  mono<MonoMocks>(
    ({ monoMock }) => {
      option = option ?? monoMock.option;
      const { height, width } = { ...option?.monoMockOpt } as unknown as {
        width: number;
        height: number;
      };

      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if ((height ?? false) && (width ?? false)) {
        monoMock.value = {
          height: height * 2,
          width: width * 2,
        };
      }
    },
    data?.monoMock ? data : undefined,
    ['monoMock'],
  );
