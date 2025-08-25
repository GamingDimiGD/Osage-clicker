import { rng } from "../../../shared/shared.js"
import { tsParticles } from "https://cdn.jsdelivr.net/npm/@tsparticles/engine@3.1.0/+esm";
import { loadAll } from "https://cdn.jsdelivr.net/npm/@tsparticles/all@3.1.0/+esm";
import { save } from "./index.js"

await loadAll(tsParticles);
const loadParticles = async (options, id = "tsparticles") => await tsParticles.load({ id, options });


const configs = {
    emitters: [],
    particles: {
        number: {
            value: 0
        },
        shape: {
            type: "image",
            options: {
                image: [
                    {
                        src: "osagery/smol.png",
                    }
                ]
            }
        },
        size: {
            value: {
                min: 15,
                max: 25,
            }
        },

        move: {
            enable: true,
            speed: { min: 20, max: 30 },
            outModes: {
                default: "none",
                bottom: "destroy"
            },
            gravity: {
                enable: true,
                acceleration: 9.81,
                maxSpeed: 100
            }
        },
        rotate: {
            value: { min: 0, max: 360 },
            animation: {
                enable: true,
                speed: { min: 0, max: 360 },
                sync: false
            }
        }
    },
}
let osageContainer = await loadParticles(configs, 'flying-osage')

export const spawnOsage = async (e, amount = 1) => {
    if (!save.options.Particles) return;
    osageContainer.addEmitter({
        position: { x: e.clientX / window.innerWidth * 100, y: e.clientY / window.innerHeight * 100 },
        size: { width: 0, height: 0 },
        life: {
            count: 1,
            duration: 0.02,
            delay: 0
        },
        rate: {
            quantity: amount,
            delay: 0
        }
    })
}
export const rain = async () => {
    let configs = {
        particles: {
            number: {
                value: 0
            },
            color: {
                value: "#b2d2dbff"
            },
            shape: {
                type: "image",
                options: {
                    image: [
                        {
                            src: "osagery/non-osagery/rain.png",
                            width: 2,
                            height: 15
                        }
                    ]
                }
            },
            opacity: {
                value: 1
            },
            size: {
                value: {
                    min: 2,
                    max: 2
                }
            },
            move: {
                enable: true,
                direction: "bottom",
                straight: true,
                outModes: {
                    default: "none",
                    bottom: "destroy"
                },
                speed: { min: 35, max: 45 },
                gravity: {
                    enable: true,
                    acceleration: 9.81,
                    maxSpeed: 100
                }
            },
            rotate: {
                value: save.options["Rain Angle"] - 90,
            }
        },
        emitters: [{
            direction: save.options["Rain Angle"],
            rate: { delay: 0, quantity: 0.1 },
            size: { width: 200, height: 0 },
            position: { x: 50, y: -2 }
        }]
    };
    let container = await loadParticles(configs, 'rain');
    return {
        start: async () => {
            container.addEmitter({
                direction: save.options["Rain Angle"],
                rate: { delay: 0, quantity: 0.1 },
                size: { width: 100, height: 0 },
                position: { x: 50, y: -2 }
            })
        },
        stop: () => {
            container.removeEmitter()
        },
        reload: async () => {
            configs.particles.rotate.value = save.options["Rain Angle"] - 90
            configs.emitters[0].direction = save.options["Rain Angle"]
            container.stop()
            container = await loadParticles(configs, 'rain');
        }
    }
}
