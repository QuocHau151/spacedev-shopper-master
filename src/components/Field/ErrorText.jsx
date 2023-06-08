import styled from "styled-components";

export const ErrorText = styled.span`
    color: red;
    position: absolute;
    font-size: 0.875rem;
    font-style: italic;
`

export const FieldStyle = styled.div`
    &.error {
        .form-control {
            border-color: red;
            color: red;
            ::placeholder {
                color: red;
            }
        }
    }
`