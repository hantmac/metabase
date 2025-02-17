import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "__support__/ui";
import type { ValuesSourceType } from "metabase-types/api/parameters";
import type { UiParameter } from "metabase-lib/parameters/types";
import { createMockUiParameter } from "metabase-lib/parameters/mock";
import ParameterLinkedFilters from "./ParameterLinkedFilters";

interface SetupOpts {
  parameter: UiParameter;
  otherParameters: UiParameter[];
}

const setup = ({ parameter, otherParameters }: SetupOpts) => {
  const onChangeFilteringParameters = jest.fn();
  const onShowAddParameterPopover = jest.fn();

  renderWithProviders(
    <ParameterLinkedFilters
      parameter={parameter}
      otherParameters={otherParameters}
      onChangeFilteringParameters={onChangeFilteringParameters}
      onShowAddParameterPopover={onShowAddParameterPopover}
    />,
  );

  return { onChangeFilteringParameters, onShowAddParameterPopover };
};

describe("ParameterLinkedFilters", () => {
  it("should toggle filtering parameters", () => {
    const { onChangeFilteringParameters } = setup({
      parameter: createMockUiParameter({
        id: "p1",
        name: "P1",
      }),
      otherParameters: [
        createMockUiParameter({
          id: "p2",
          name: "P2",
        }),
      ],
    });

    userEvent.click(screen.getByRole("switch"));

    expect(onChangeFilteringParameters).toHaveBeenCalledWith(["p2"]);
  });

  it.each(["static-list", "card"])(
    "should not show linked filter options if the parameter has a %s source",
    valuesSourceType => {
      setup({
        parameter: createMockUiParameter({
          id: "p1",
          name: "P1",
          values_source_type: valuesSourceType as ValuesSourceType,
          values_source_config: {
            values: ["foo", "bar"],
          },
        }),
        otherParameters: [
          createMockUiParameter({
            id: "p2",
            name: "P2",
          }),
        ],
      });

      expect(
        screen.getByText(
          "If the filter has values that are from another question or model, or a custom list, then this filter can't be limited by another dashboard filter.",
        ),
      ).toBeInTheDocument();
      expect(screen.queryByRole("switch")).not.toBeInTheDocument();
    },
  );
});
