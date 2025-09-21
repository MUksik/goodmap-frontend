import axios from 'axios';
import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 20px;
    border: 1.5px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    max-width: 400px;
    margin: 0 auto;
`;

const Label = styled.label`
    display: flex;
    flex-direction: column;
    font-size: 1rem;
    color: #333;
    font-weight: 500;
`;

const Select = styled.select`
    padding: 5px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    transition: border-color 0.3s ease;

    &:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }
`;

const Input = styled.input`
    padding: 5px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    transition: border-color 0.3s ease;

    &:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }
`;

const SubmitButton = styled.input`
   padding: 12px;
    background-color: #2c4f5b;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: 600;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #204653ff;
    }

    &:active {
        background-color: #103542ff;
    }
`;

export const ReportProblemForm = ({ placeId }) => {
    const { t } = useTranslation();
    const [problem, setProblem] = useState('');
    const [problemType, setProblemType] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [imageFile, setImageFile] = useState(null);

    const fetchCsrfToken = async () => {
        const response = await axios.get('/api/generate-csrf-token');
        return response.data.csrf_token;
    };

    const handleSubmit = async event => {
        event.preventDefault();
        const csrfToken = await fetchCsrfToken();

        const imageInfo = imageFile ? imageFile.name : null;

        const response = await axios.post(
            '/api/report-location',
            {
                id: placeId,
                description: problemType === 'other' ? problem : problemType,
                image: imageInfo,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
            },
        );

        const responseData = response.data;
        setResponseMessage(responseData.message);
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return <p>{responseMessage}</p>;
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Label>
                Problem:
                <Select value={problemType} onChange={e => setProblemType(e.target.value)}>
                    <option value="">--{t('reportChooseOption')}--</option>
                    <option value="notHere">{t('reportNotHere')}</option>
                    <option value="overload">{t('reportOverload')}</option>
                    <option value="broken">{t('reportBroken')}</option>
                    <option value="other">{t('reportOther')}</option>
                </Select>
            </Label>
            {problemType === 'other' && (
                <Label>
                    {t('describeOtherProblem')}:
                    <Input
                        type="text"
                        name="problem"
                        value={problem}
                        onChange={e => setProblem(e.target.value)}
                    />
                </Label>
            )}
            <Label>
                {t('Dodaj zdjęcie')}:
                <Input
                    type="file"
                    accept="image/*"
                    onChange={e => setImageFile(e.target.files[0])}
                />
            </Label>
            {problemType !== '' && <SubmitButton type="submit" value={t('submitProblem')} />}
        </Form>
    );
};

ReportProblemForm.propTypes = {
    placeId: PropTypes.string.isRequired,
};
