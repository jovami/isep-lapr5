import { assert } from 'chai'
import { describe, it } from 'mocha'

import { ElevatorModel } from './model'

describe('Elevator Model', () => {
    it('cannot be longer than 50 characters', () => {
        const brands = [
            '8as9dg8aud90ag98fg9g89g9g9GF98G89G89G89GF8GF8Gf89GHFUIH98Gf89GFUDH9UH98F9',
            'A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8S9t0U1v2W3x4Y5z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5T6U7V8W9X0Y1Z2',
            'aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789abcdefghijklmnopqrstuvwx',
            '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
            'QwErTyUiOpAsDfGhJkLzXcVbNmQwErTyUiOpAsDfGhJkLzXcVbNm',
            'LdKjFa7p5MnHbP6gJqIv0wRtS1zTcN9XmY4z3V2K6aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789',
            '6oLg5iN8jMw9tOu0yPvX2s3HrIqZbCd7AeK6oLg5iN8jMw9tOu0yPvX2s3HrIqZbCd',
            'XxYyZzAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWw1234567890XxYyZzAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPp',
            'T7s8K9p0Rq1W2i3Y4u5Iv6Dw7Xe8F9z0G1h2J3k4L5m6N7o8991',
            'UvWw0XxYyZzAaBbCcDdEeFfGgHhIiJjKkLlMnOoPqRrSsTt1234567890UvWwXxYyZzAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPqRrSsTt',
        ]

        brands.forEach((b) => assert.isNotOk(ElevatorModel.create(b).isSuccess))

        // less than 50 chars
        assert.isOk(ElevatorModel.create('3100').isSuccess)
    })

    it('must be alphanumeric', () => {
        let model = ElevatorModel.create('3100')
        assert.isOk(model.isSuccess)

        model = ElevatorModel.create('3300')
        assert.isOk(model.isSuccess)

        model = ElevatorModel.create('3300XL')
        assert.isOk(model.isSuccess)

        model = ElevatorModel.create('asd$#!1#%')
        assert.isNotOk(model.isSuccess)
    })

    it('can contain spaces', () => {
        let model = ElevatorModel.create('3300 XL')
        assert.isOk(model.isSuccess)

        model = ElevatorModel.create('6400 NA')
        assert.isOk(model.isSuccess)

        model = ElevatorModel.create('Miconic TX')
        assert.isOk(model.isSuccess)

        model = ElevatorModel.create('as d$ #!1# %')
        assert.isNotOk(model.isSuccess)
    })
})
