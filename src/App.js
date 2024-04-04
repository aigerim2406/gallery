import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
    const [images, setImages] = useState([]); //загрузка массивов
    const [isLoading, setIsLoading] = useState(true); //указывает текущее состояние загрузка изображений

    useEffect(() => {
        fetchImages();
    }, []); //шакыру аркылы, Unsplash-тан суреттерди алады

    const fetchImages = async () => {
        try {
            const response = await fetch('https://api.unsplash.com/photos/?client_id=ml1_RrVanz5nojRdROE7jqSH7_2ofCUQKJcCcIl-ZpM');
            const data = await response.json();
            setImages(data); //состояниеси сакталады
            setIsLoading(false); //когда закончится, возвращает false
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    useEffect(() => {
        const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        console.log('Load time:', loadTime);
    }, []); //тайминг загрузка изображений

    return (
        <div className="App">
            <h1>Gaba's Gallery</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="image-container">
                    {images.map((image) => (
                        <LazyImage key={image.id} src={image.urls.small} alt={`Image_${image.id}`} />
                    ))}
                </div>
            )}
        </div>
    );
}

const LazyImage = ({ src, alt }) => {
    const [imageSrc, setImageSrc] = useState(null); //загрузка имейджов
    const [isVisible, setIsVisible] = useState(false); //экранда коринеме жокпа соны карайды
    const imageRef = useRef(null); //сохраняет значение

    useEffect(() => {
        const observer = new IntersectionObserver(handleIntersect);
        observer.observe(imageRef.current);
        return () => observer.disconnect();
    }, [imageRef]);

    const handleIntersect = (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
            }
        });
    };

    useEffect(() => {
        if (isVisible && !imageSrc) {
            setImageSrc(src);
        }
    }, [isVisible, imageSrc, src]);

    return <img ref={imageRef} src={imageSrc} alt={alt} />;
};

export default App;
