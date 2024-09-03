"use client";

import { useBridgeNetwork } from "@/context/bridge-network";
import { Form, Formik, FormikHelpers } from "formik";
import { number, object, Schema } from "yup";
import { useConnection } from "@/hooks/useConnection";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { useCoins } from "@/hooks/useCoins";
import { Coin } from "@/config/coinConfigs";
import { Select } from "../select";

export type SelectCoinsProps = {
  onBack: () => void;
  onContinue: () => void;
};

type StakeForm = { value: number | null };

const validationSchema: Schema<StakeForm> = object()
  .shape({
    value: number()
      .required("Amount is required")
      .positive("Amount must be positive")
      .typeError("Amount must be a number"),
  })
  .defined();

export const SelectCoins = ({ onContinue, onBack }: SelectCoinsProps) => {
  const { coin, setCoin, amount, setAmount } = useBridgeNetwork();
  const coins = useCoins();
  const { account } = useConnection();
  const { balance: tokenBalance } = useTokenBalance();

  const handleCoinChange = (selectedOption: any) => {
    const selectedCoin = selectedOption as Coin;
    setCoin(selectedCoin);
  };

  const submit = async (
    form: StakeForm,
    formikHelpers: FormikHelpers<StakeForm>
  ) => {
    if (form?.value) {
      const onReset = () => {
        formikHelpers.resetForm();
      };
      onContinue();
      onReset();
    }
  };

  const initialValues: StakeForm = { value: amount || null };

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg">Select coin</h2>
      <Select
        id="select-coin"
        value={coin}
        onChange={handleCoinChange}
        options={coins}
      />
      <div className="flex flex-col gap-5">
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={(values, formikHelpers) => submit(values, formikHelpers)}
        >
          {({ values, errors, handleChange, setFieldValue, resetForm }) => (
            <Form noValidate={true}>
              <div className="flex gap-4 flex-col">
                <div className="flex flex-col gap-4 items-start w-full">
                  <div className="flex sm:flex-row flex-col gap-4 items-center w-full">
                    <input
                      type="number"
                      name="value"
                      placeholder="Amount"
                      className="input input-bordered w-full"
                      value={values.value || ""}
                      disabled={!account}
                      onChange={(e) => {
                        resetForm();
                        const value = e.target.value.replace(",", ".");
                        handleChange({
                          target: { name: e.target.name, value },
                        });
                        setAmount(value);
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={!account}
                      onClick={() => {
                        setFieldValue("value", tokenBalance);
                        setAmount(tokenBalance);
                      }}
                    >
                      Max
                    </button>
                  </div>
                  {errors.value && (
                    <p className="text-xs text-error uppercase">
                      {errors.value?.toString()}
                    </p>
                  )}
                </div>
                <div className="w-full flex flex-col sm:flex-row justify-between gap-4">
                  <button className="btn btn-sm md:btn-md lg:btn-lg flex-grow" onClick={onBack}>
                    Back
                  </button>
                  <button
                    className="btn btn-sm md:btn-md lg:btn-lg btn-primary flex-grow"
                    type="submit"
                    disabled={!coin || !amount}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
